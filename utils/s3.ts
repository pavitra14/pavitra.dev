import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_BUCKET_NAME || 'pavitra-dev-cms';

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const getS3Object = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const response = await s3Client.send(command);
  const str = await response.Body?.transformToString();
  return str;
};

export const putS3Object = async (key: string, body: string, contentType = 'text/markdown') => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);
};

export const listS3Objects = async (prefix = 'blogs/') => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });
  const response = await s3Client.send(command);
  return response.Contents || [];
};

export const deleteS3Object = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  await s3Client.send(command);
};
