import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { listS3Objects, getS3Object, putS3Object, deleteS3Object } from '@/utils/s3';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  try {
    if (key) {
      const content = await getS3Object(key);
      return NextResponse.json({ content });
    } else {
      const objects = await listS3Objects('blogs/');
      return NextResponse.json({
        posts: objects.map((obj) => ({ key: obj.Key, lastModified: obj.LastModified, size: obj.Size })),
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, content } = await request.json();
    if (!key || !content) {
      return NextResponse.json({ error: 'Missing key or content' }, { status: 400 });
    }

    // Default prefix if not provided
    const s3Key = key.startsWith('blogs/') ? key : `blogs/${key}`;
    await putS3Object(s3Key, content);

    revalidateTag('blogs', 'default'); // Instantly invalidate frontend blog cache

    return NextResponse.json({ success: true, key: s3Key });
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
    revalidateTag('blogs', 'default'); // Instantly invalidate frontend blog cache
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
