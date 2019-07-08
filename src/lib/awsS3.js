import { S3 } from 'aws-sdk';
import uuidv1 from 'uuid/v1';

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  apiVersion: '2006-03-01',
});

const Bucket = 'backyourstack-test';

export const uploadFiles = files => {
  const count = Object.keys(files).length;
  const folder = `Project-${uuidv1()}`;
  const promises = [];
  Object.entries(files).map(([id, file]) => {
    const filename = [uuidv1(), '.json'].join('');
    let key;
    if (count > 1) {
      key = `${folder}/${filename}`;
    } else {
      key = filename;
    }
    const uploadParam = {
      Bucket,
      Key: key,
      Body: JSON.stringify(file.json),
      ACL: 'public-read',
      ContentType: 'application/json',
    };
    promises.push(s3.upload(uploadParam).promise());
  });
  return Promise.all(promises);
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
