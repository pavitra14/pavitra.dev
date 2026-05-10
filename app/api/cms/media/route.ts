import { NextResponse } from 'next/server';
import { listS3Objects, deleteS3Object } from '@/utils/s3';

export async function GET(request: Request) {
  try {
    const objects = await listS3Objects('media/');
    // Return objects with public URLs if they are public, or just paths
    const media = objects.map((obj) => ({
      key: obj.Key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`,
      lastModified: obj.LastModified,
      size: obj.Size,
    }));
    return NextResponse.json({ media });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isPublic = formData.get('isPublic') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create a safe filename
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `media/${Date.now()}-${safeFilename}`;

    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const { s3Client } = await import('@/utils/s3');

    const commandParams: any = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    // Note: If the bucket has "Object Ownership: Bucket owner enforced", setting ACL will fail.
    // Ensure bucket allows ACLs if using this feature.
    if (isPublic) {
      commandParams.ACL = 'public-read';
    }

    const command = new PutObjectCommand(commandParams);
    await s3Client.send(command);

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return NextResponse.json({ success: true, key, url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  try {
    await deleteS3Object(key);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
