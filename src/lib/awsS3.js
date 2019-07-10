import { S3 } from 'aws-sdk';
import uuidv1 from 'uuid/v1';
import { keys } from 'lodash';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  apiVersion: '2006-03-01',
});

const Bucket = process.env.AWS_S3_BUCKET;

export const uploadFiles = async files => {
  const count = Object.keys(files).length;
  // For a single file
  if (count === 1) {
    const id = keys(files)[0];
    const key = [id, '.json'].join('');
    const body = { [id]: files[id] };
    return saveFileToS3(key, body);
  } else {
    const metaData = {};
    // Save individual files and get their metaData
    for (const id in files) {
      const key = [id, '.json'].join('');
      const body = { [id]: files[id] };
      const data = await saveFileToS3(key, body);
      metaData[id] = { url: data.Location, key: data.Key };
    }
    // Save the metaData as a folder file
    const folderKey = [uuidv1(), '.json'].join('');
    return saveFileToS3(folderKey, metaData);
  }
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

export const getFile = key => {
  const Key = `${key}.json`;
  const params = {
    Bucket,
    Key,
    ResponseContentType: 'application/json',
  };

  return s3.getObject(params).promise();
};

export const getMultipleFiles = async key => {
  const data = {};
  let metaData;

  try {
    const file = await getFile(key);
    metaData = JSON.parse(file.Body.toString('utf-8'));
  } catch (err) {
    throw new Error('Invalid file content');
  }

  for (const id in metaData) {
    const key = metaData[id].key.replace('.json', ''); // getFile method expect key without ext hence why remove .json
    let content = await getFile(key);
    content = JSON.parse(content.Body.toString('utf-8'));
    data[id] = content[id];
  }
  return data;
};
