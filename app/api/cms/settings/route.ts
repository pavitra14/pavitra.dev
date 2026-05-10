import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getS3Object, putS3Object } from '@/utils/s3';

const SETTINGS_KEY = 'settings/homepage.json';

export async function GET() {
  try {
    const content = await getS3Object(SETTINGS_KEY);
    if (!content) {
      return NextResponse.json({ settings: {} });
    }
    return NextResponse.json({ settings: JSON.parse(content) });
  } catch (error: any) {
    // If object doesn't exist, return empty
    return NextResponse.json({ settings: {} });
  }
}

export async function POST(request: Request) {
  try {
    const { settings } = await request.json();
    await putS3Object(SETTINGS_KEY, JSON.stringify(settings, null, 2), 'application/json');
    revalidateTag('settings', 'default'); // Instantly invalidate frontend settings cache
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
