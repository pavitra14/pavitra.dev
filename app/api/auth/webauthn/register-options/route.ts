import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { auth } from '@/auth';
import { getPasskeys } from '@/utils/passkeys';

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userPasskeys = await getPasskeys();

  const options = await generateRegistrationOptions({
    rpName: 'Pavitra CMS',
    rpID: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : 'localhost',
    userName: session.user.email || 'admin',
    userDisplayName: session.user.name || session.user.email || 'admin',
    userID: session.user?.email || 'admin',
    attestationType: 'none',
    excludeCredentials: userPasskeys.map((passkey) => ({
      id: Buffer.from(passkey.id, 'base64url'),
      type: 'public-key',
      transports: passkey.transports as any,
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
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
