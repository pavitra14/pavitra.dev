import { NextResponse } from 'next/server';
import { getS3Object } from '@/utils/s3';
import { signToken } from '@/utils/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    // Read the KEY file from S3
    const s3KeyContent = await getS3Object('KEY');
    if (!s3KeyContent) {
      return NextResponse.json({ error: 'KEY file not found in S3 bucket' }, { status: 500 });
    }

    // Compare
    const actualPassword = s3KeyContent.trim();
    if (password === actualPassword) {
      const token = await signToken({ admin: true });

      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        // Keep cookie practically forever
        maxAge: 60 * 60 * 24 * 365 * 10,
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
