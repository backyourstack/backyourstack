import Promise from 'bluebird';
import { S3 } from 'aws-sdk';
import uuidv1 from 'uuid/v1';

import logger from '../logger';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  apiVersion: '2006-03-01',
});

const Bucket = process.env.AWS_S3_BUCKET;

export const uploadFiles = async files => {
  const metadata = { objectKeys: [] };
  const identifier = uuidv1();
  for (const id in files) {
    const key = `${identifier}/${files[id].name}`;
    const body = { [id]: files[id] };
    const data = await saveFileToS3(key, body);
    metadata.objectKeys = [...metadata.objectKeys, data.Key];
  }
  const folderKey = `${identifier}/dependencies.json`;
  return saveFileToS3(folderKey, metadata);
};

export const saveFileToS3 = (Key, Body) => {
  const uploadParam = {
    Bucket,
    Key,
    Body: JSON.stringify(Body, null, 2),
    ACL: 'public-read',
    ContentType: 'application/json',
  };
  return s3.upload(uploadParam).promise();
};

export const saveProfile = async (profileId, repos) => {
  repos = repos.filter(repo => repo.files);

  const objectKeys = await Promise.map(repos, repo => saveProfileFiles(repo), {
    concurrency: 10,
  }).reduce((acc, keys) => [...acc, ...keys], []);

  const dependencyFile = await saveFileToS3(`${profileId}/dependencies.json`, {
    objectKeys,
  });
  return dependencyFile.Key.split('/')[0];
};

export const saveProfileFiles = repo => {
  return Promise.map(repo.files, async file => {
    const data = await saveFileToS3(`${repo.full_name}/${file.name}`, {
      [file.id]: file,
    });
    return data.Key;
  });
};

export const getObjectList = id => {
  const params = {
    Bucket,
    Prefix: `${id}/`,
  };
  return s3.listObjects(params).promise();
};

export const getFile = async key => {
  logger.debug(`Fetching file from S3: ${key}`);
  const params = { Bucket, Key: key };
  const { Body } = await s3.getObject(params).promise();
  return Body.toString('utf-8');
};

export const getFiles = async id => {
  const { objectKeys } = await getObjectsMetadata(id);

  if (objectKeys.length === 0) {
    return {};
  }

  const files = await Promise.map(
    objectKeys,
    key =>
      getFile(key)
        .then(rawFile => JSON.parse(rawFile))
        .catch(),
    { concurrency: 10 },
  );

  return files.reduce((acc, file) => (file ? { ...acc, ...file } : acc), {});
};

export const getObjectsMetadata = async id => {
  const params = { Bucket, Key: `${id}/dependencies.json` };
  const { Body } = await s3.getObject(params).promise();
  return JSON.parse(Body.toString('utf-8'));
};

export const saveSelectedDependencies = async (id, selectedDependencies) => {
  const metadata = await getObjectsMetadata(id);
  metadata.selectedDependencies = selectedDependencies;
  return saveFileToS3(`${id}/dependencies.json`, metadata);
};

export const saveProfileOrder = (id, order) => {
  return saveFileToS3(`${id}/order.json`, order);
};
