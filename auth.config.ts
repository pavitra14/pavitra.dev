import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginRoute = nextUrl.pathname.startsWith('/admin/login');

      if (isLoginRoute) {
        return true; // Always allow the login page to be accessed
      }

      return isLoggedIn; // Require login for all other matched routes
    },
    jwt({ token, user, profile }) {
      if (user) {
        token.role = (user as any).role || 'CONTRIBUTOR';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.role) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
  trustHost: true,
  secret: process.env.ENC_SECRET || 'fallback-super-secret-key-for-authjs-123456',
} satisfies NextAuthConfig;
