import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Parse .env manually for standalone script
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

const region = process.env.AWS_REGION || 'us-east-1';
const bucket = process.env.AWS_BUCKET_NAME || 'pavitra-dev-cms';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const listS3Objects = async (prefix = '') => {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });
  const response = await s3Client.send(command);
  return response.Contents || [];
};

async function main() {
  try {
    console.log('--- Inspecting S3 Bucket ---');
    console.log(`Bucket: ${bucket}`);
    
    const all = await listS3Objects('');
    console.log(`Total Objects: ${all.length}`);

    const categories = {
      blogs: all.filter(o => o.Key?.startsWith('blogs/')),
      authors: all.filter(o => o.Key?.startsWith('authors/')),
      settings: all.filter(o => o.Key?.startsWith('settings/')),
      media: all.filter(o => o.Key?.startsWith('media/')),
      other: all.filter(o => !o.Key?.match(/^(blogs|authors|settings|media)\//))
    };

    for (const [cat, items] of Object.entries(categories)) {
      console.log(`\n[${cat.toUpperCase()}] - ${items.length} items`);
      items.forEach(i => console.log(` - ${i.Key} (${i.Size} bytes)`));
    }

  } catch (error) {
    console.error('Error inspecting S3:', error);
  }
}

main();
