import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  });
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
const bucket = process.env.AWS_BUCKET_NAME || 'pavitra-dev-cms';

async function main() {
  console.log('--- Initializing S3 Default Files ---');
  
  // 1. Default Homepage Settings
  const defaultSettings = {
    resumeLink: '',
    description: 'Welcome to my enterprise-grade CMS built entirely on S3.',
    pictureUrl: ''
  };

  try {
    console.log('Uploading settings/homepage.json...');
    await s3Client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: 'settings/homepage.json',
      Body: JSON.stringify(defaultSettings, null, 2),
      ContentType: 'application/json'
    }));
    console.log('✅ Success: Homepage settings populated.');
  } catch (e) {
    console.error('❌ Failed to upload settings:', e);
  }

}

main();
