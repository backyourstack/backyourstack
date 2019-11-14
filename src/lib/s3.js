import { S3 } from 'aws-sdk';
import uuidv1 from 'uuid/v1';

import { getFilesData } from '../lib/data';

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
  const metadata = { objectKeys: [] };
  for (const repo of repos) {
    if (repo.files) {
      const objectKeys = await saveProfileFiles(profileId, repo);
      metadata.objectKeys = [...metadata.objectKeys, ...objectKeys];
    }
  }
  const key = `${profileId}/dependencies.json`;
  const savedFile = await saveFileToS3(key, metadata);
  return savedFile.Key.split('/')[0];
};

export const saveProfileFiles = async (profileId, repo) => {
  const savedObjectKeys = [];
  for (const file of repo.files) {
    const key = `${repo.full_name}/${file.name}`;
    const body = { [file.id]: file };
    const data = await saveFileToS3(key, body);
    savedObjectKeys.push(data.Key);
  }
  return savedObjectKeys;
};

export const getObjectList = id => {
  const params = {
    Bucket,
    Prefix: `${id}/`,
  };
  return s3.listObjects(params).promise();
};

export const getFiles = async id => {
  const { objectKeys } = await getObjectsMetadata(id);
  const data = {};

  if (objectKeys.length === 0) {
    return {};
  }

  for (const key of objectKeys) {
    const params = { Bucket, Key: key };
    const { Body } = await s3.getObject(params).promise();
    const file = JSON.parse(Body.toString('utf-8'));

    Object.assign(data, file);
  }
  return data;
};

export const getObjectsMetadata = async id => {
  const params = { Bucket, Key: `${id}/dependencies.json` };
  const { Body } = await s3.getObject(params).promise();
  return JSON.parse(Body.toString('utf-8'));
};

export const getSavedFilesData = async id => {
  const data = await getFiles(id);
  if (!data) {
    return null;
  }
  return getFilesData(data);
};
