import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { auth } from '@/auth';
import { savePasskey } from '@/utils/passkeys';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = await cookies();
  const expectedChallenge = cookieStore.get('webauthn_challenge')?.value;
  if (!expectedChallenge) {
    return NextResponse.json({ error: 'Missing challenge' }, { status: 400 });
  }

  const body = await request.json();

  try {
    const verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      expectedRPID: process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname : 'localhost',
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

      // Ensure credentialID and credentialPublicKey are stored as base64url strings
      await savePasskey({
        id: Buffer.from(credentialID).toString('base64url'),
        publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
        counter,
        transports: body.response.transports,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
