import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    return <div className="p-8 text-center text-red-500">Not Authenticated</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
            Enterprise CMS
          </span>
        </div>
        <div className="p-4">
          <div className="mb-4 text-xs font-semibold tracking-wider text-gray-500 uppercase">Menu</div>
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/content-types"
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Content Types
            </Link>
            <Link
              href="/admin/entries"
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Entries
            </Link>
            <Link
              href="/admin/media"
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Media Library
            </Link>
            <Link
              href="/admin/settings"
              className="block rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {session.user.name || session.user.email} ({(session.user as any).role})
            </div>
            {/* Simple logout form or link */}
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-500">
                Sign Out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-gray-50 p-6 dark:bg-gray-900/50">{children}</main>
      </div>
    </div>
  );
}
