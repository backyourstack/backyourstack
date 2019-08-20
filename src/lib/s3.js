import { S3 } from 'aws-sdk';
import uuidv1 from 'uuid/v1';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  apiVersion: '2006-03-01',
});

const Bucket = process.env.AWS_S3_BUCKET;

export const uploadFiles = async files => {
  const metaData = {};
  const identifier = uuidv1();
  for (const id in files) {
    const key = `${identifier}/${id}.json`;
    const body = { [id]: files[id] };
    const data = await saveFileToS3(key, body);
    metaData[id] = { url: data.Location };
  }
  const folderKey = `${identifier}/dependencies.json`;
  return saveFileToS3(folderKey, { files: metaData });
};

export const saveFileToS3 = (Key, Body) => {
  const uploadParam = {
    Bucket,
    Key,
    Body: JSON.stringify(Body),
    ACL: 'public-read',
    ContentType: 'application/json',
  };
  return s3.upload(uploadParam).promise();
};

export const saveProfile = async (profileId, repos) => {
  const metaData = { profile: true, files: {} };
  for (const repo of repos) {
    if (repo.files) {
      const savedFileUrls = await saveProfileFiles(profileId, repo.files);
      metaData.files[repo.name] = {
        urls: [savedFileUrls],
        private: repo.private,
      };
    }
  }
  const key = `${profileId}/dependencies.json`;
  return saveFileToS3(key, metaData);
};

export const saveProfileFiles = async (profileId, files) => {
  const savedFileUrls = [];
  for (const file of files) {
    const key = `${profileId}/${uuidv1()}.json`;
    const body = { [file.id]: file };
    const data = await saveFileToS3(key, body);
    savedFileUrls.push(data.Location);
  }
  return savedFileUrls;
};

export const getObjectList = uuid => {
  const params = {
    Bucket,
    Prefix: `${uuid}/`,
  };
  return s3.listObjects(params).promise();
};

export const getFiles = async uuid => {
  const { Contents } = await getObjectList(uuid);
  const data = {};

  if (Contents.length === 0) {
    return {};
  }

  for (const content of Contents) {
    // checks if it is the index file and skips over it
    if (content.Key.indexOf('dependencies') !== -1) {
      continue;
    }
    const params = { Bucket, Key: content.Key };
    const { Body } = await s3.getObject(params).promise();
    const file = JSON.parse(Body.toString('utf-8'));
    Object.assign(data, file);
  }
  return data;
};
