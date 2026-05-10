import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getPasskeys } from '@/utils/passkeys';

export async function GET() {
  const userPasskeys = await getPasskeys();

  const options = await generateAuthenticationOptions({
    rpID: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : 'localhost',
    allowCredentials: userPasskeys.map((passkey) => ({
      id: Buffer.from(passkey.id, 'base64url'),
      type: 'public-key',
      transports: passkey.transports as any,
    })),
    userVerification: 'preferred',
  });

  const response = NextResponse.json(options);
  response.cookies.set('webauthn_challenge', options.challenge, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300, // 5 minutes
    path: '/',
  });

  return response;
}
