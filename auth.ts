import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { getS3Object } from './utils/s3';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
        webauthnResponse: { label: 'Passkey Response', type: 'text' },
      },
      async authorize(credentials) {
        try {
          // Passkey (WebAuthn) Login Flow
          if (credentials?.webauthnResponse) {
            const { verifyAuthenticationResponse } = await import('@simplewebauthn/server');
            const { getPasskeys } = await import('./utils/passkeys');
            const { cookies } = await import('next/headers');

            const expectedChallenge = cookies().get('webauthn_challenge')?.value;
            if (!expectedChallenge) return null;

            const body = JSON.parse(credentials.webauthnResponse as string);
            const passkeys = await getPasskeys();
            const passkey = passkeys.find((p) => p.id === body.id);

            if (!passkey) return null;

            const verification = await verifyAuthenticationResponse({
              response: body,
              expectedChallenge,
              expectedOrigin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              expectedRPID: process.env.NEXT_PUBLIC_APP_URL
                ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname
                : 'localhost',
              authenticator: {
                credentialID: Buffer.from(passkey.id, 'base64url'),
                credentialPublicKey: Buffer.from(passkey.publicKey, 'base64url'),
                counter: passkey.counter,
                transports: passkey.transports as any,
              },
            });

            if (verification.verified) {
              return { id: '1', name: 'Super Admin', email: 'me@pavitra.dev', role: 'SUPER_ADMIN' };
            }
            return null;
          }

          // Standard Password Login Flow
          const s3KeyContent = await getS3Object('KEY');
          const adminPassword = s3KeyContent?.trim();

          if (adminPassword && credentials?.password === adminPassword) {
            return { id: '1', name: 'Super Admin', email: 'me@pavitra.dev', role: 'SUPER_ADMIN' };
          }
        } catch (error) {
          console.error('Error verifying login credentials:', error);
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
});
