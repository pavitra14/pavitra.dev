import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLogin = req.nextUrl.pathname.startsWith('/admin/login');
  if (isLogin) {
    // Completely bypass Auth.js middleware for the login page to avoid infinite redirect loops
    return;
  }
});

export const config = {
  matcher: ['/admin/:path*', '/api/cms/:path*'],
};
