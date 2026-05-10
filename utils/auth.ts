import { SignJWT, jwtVerify } from 'jose';
import { getS3Object } from './s3';

let cachedS3Key: Uint8Array | null = null;
let lastFetch = 0;

async function getSecretKey() {
  const now = Date.now();
  // Cache the key for 5 minutes to prevent S3 rate limits and latency on every request
  if (cachedS3Key && now - lastFetch < 5 * 60 * 1000) {
    return cachedS3Key;
  }

  try {
    const s3KeyContent = await getS3Object('KEY');
    if (s3KeyContent) {
      cachedS3Key = new TextEncoder().encode(s3KeyContent.trim());
      lastFetch = now;
      return cachedS3Key;
    }
  } catch (error) {
    console.error('Failed to fetch KEY from S3 for JWT signature:', error);
  }

  // Fallback to env var if S3 fetch fails, to prevent total lockdown
  const fallback = process.env.AWS_SECRET_ACCESS_KEY || 'default-secret-key-fallback';
  return new TextEncoder().encode(fallback);
}

export async function signToken(payload: any) {
  const key = await getSecretKey();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // No expiration so they stay logged in until cookie cleared
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const key = await getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}
