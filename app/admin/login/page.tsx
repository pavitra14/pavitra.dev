'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { startAuthentication } from '@simplewebauthn/browser';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        password,
        redirect: false,
      });

      if (res?.ok && !res?.error) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res?.error || 'Invalid password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const optsRes = await fetch('/api/auth/webauthn/login-options');
      const options = await optsRes.json();

      if (options.error) throw new Error(options.error);

      const authResp = await startAuthentication(options);

      const res = await signIn('credentials', {
        webauthnResponse: JSON.stringify(authResp),
        redirect: false,
      });

      if (res?.ok && !res?.error) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(res?.error || 'Invalid passkey');
      }
    } catch (err: any) {
      console.error(err);
      setError('Passkey login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">CMS Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">Authenticate using the S3 KEY</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="focus:ring-primary-500 focus:border-primary-500 relative block w-full appearance-none rounded-none rounded-t-md rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter CMS Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-center text-sm font-medium text-red-500">{error}</div>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In with Password'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-800">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={loading}
              className="focus:ring-primary-500 flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Sign In with Passkey (WebAuthn)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
