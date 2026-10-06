import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import Promise from 'bluebird';
import { v1 as uuid } from 'uuid';

import logger from './logger';

let s3;

const Bucket = process.env.AWS_S3_BUCKET;

const getS3 = () => {
  if (!s3) {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      throw new Error(
        'No AWS_ACCESS_KEY_ID, set this environment key (and AWS_SECRET_KEY or AWS_SECRET_ACCESS_KEY) to allow interaction with S3.',
      );
    }
    s3 = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      followRegionRedirects: true,
      // Without AWS_SECRET_KEY, the SDK falls back to its default credential chain
      // (AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY)
      credentials: process.env.AWS_SECRET_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_KEY,
          }
        : undefined,
    });
  }
  return s3;
};

export const uploadFiles = async (files) => {
  const metadata = { objectKeys: [] };
  const identifier = uuid();
  for (const id in files) {
    const key = `${identifier}/${files[id].name}`;
    const body = { [id]: files[id] };
    const data = await saveFileToS3(key, body);
    metadata.objectKeys = [...metadata.objectKeys, data.Key];
  }
  const folderKey = `${identifier}/dependencies.json`;
  return saveFileToS3(folderKey, metadata);
};

export const saveFileToS3 = async (Key, Body) => {
  const uploadParam = {
    Bucket,
    Key,
    Body: JSON.stringify(Body, null, 2),
    ACL: 'public-read',
    ContentType: 'application/json',
  };
  await getS3().send(new PutObjectCommand(uploadParam));
  return { Bucket, Key };
};

export const saveProfile = async (profileId, repos) => {
  repos = repos.filter((repo) => repo.files);

  const objectKeys = await Promise.map(
    repos,
    (repo) => saveProfileFiles(repo),
    {
      concurrency: 10,
    },
  ).reduce((acc, keys) => [...acc, ...keys], []);

  const dependencyFile = await saveFileToS3(`${profileId}/dependencies.json`, {
    objectKeys,
  });
  return dependencyFile.Key.split('/')[0];
};

export const saveProfileFiles = (repo) => {
  return Promise.map(repo.files, async (file) => {
    const data = await saveFileToS3(`${repo.full_name}/${file.name}`, {
      [file.id]: file,
    });
    return data.Key;
  });
};

export const getObjectList = (id) => {
  const params = {
    Bucket,
    Prefix: `${id}/`,
  };
  return getS3().send(new ListObjectsCommand(params));
};

export const getFile = async (key) => {
  logger.debug(`Fetching file from S3: ${key}`);
  const params = { Bucket, Key: key };
  const { Body } = await getS3().send(new GetObjectCommand(params));
  return Body.transformToString('utf-8');
};

export const getFiles = async (id) => {
  const { objectKeys } = await getObjectsMetadata(id);

  if (objectKeys.length === 0) {
    return {};
  }

  const files = await Promise.map(
    objectKeys,
    (key) =>
      getFile(key)
        .then((rawFile) => JSON.parse(rawFile))
        .catch(),
    { concurrency: 10 },
  );

  return files.reduce((acc, file) => (file ? { ...acc, ...file } : acc), {});
};

export const getObjectsMetadata = async (id) => {
  const params = { Bucket, Key: `${id}/dependencies.json` };
  try {
    const { Body } = await getS3().send(new GetObjectCommand(params));
    return JSON.parse(await Body.transformToString('utf-8'));
  } catch (err) {
    return null;
  }
};

export const saveSelectedDependencies = async (id, selectedDependencies) => {
  const metadata = await getObjectsMetadata(id);
  metadata.selectedDependencies = selectedDependencies;
  return saveFileToS3(`${id}/dependencies.json`, metadata);
};

export const saveProfileOrder = (id, order) => {
  return saveFileToS3(`${id}/order.json`, order);
};
