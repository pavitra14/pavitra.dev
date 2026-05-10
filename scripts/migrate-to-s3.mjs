import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_BUCKET_NAME || 'pavitra-dev-cms';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("Missing AWS credentials in .env");
  process.exit(1);
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(filePath, s3Key) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: content,
    ContentType: 'text/markdown',
  });
  
  try {
    await s3Client.send(command);
    console.log(`Successfully uploaded: ${s3Key}`);
  } catch (err) {
    console.error(`Failed to upload ${s3Key}:`, err);
  }
}

async function migrateDirectory(localDir, s3Prefix) {
  const files = fs.readdirSync(localDir);
  
  for (const file of files) {
    const fullPath = path.join(localDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      await migrateDirectory(fullPath, `${s3Prefix}${file}/`);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      const s3Key = `${s3Prefix}${file}`;
      await uploadFile(fullPath, s3Key);
    }
  }
}

async function run() {
  console.log(`Starting migration to S3 Bucket: ${bucket}`);
  
  const blogsDir = path.join(rootDir, 'data', 'blog');
  if (fs.existsSync(blogsDir)) {
    console.log("Migrating blogs...");
    await migrateDirectory(blogsDir, 'blogs/');
  }
  
  const authorsDir = path.join(rootDir, 'data', 'authors');
  if (fs.existsSync(authorsDir)) {
    console.log("Migrating authors...");
    await migrateDirectory(authorsDir, 'authors/');
  }
  
  console.log("Migration complete!");
}

run();
