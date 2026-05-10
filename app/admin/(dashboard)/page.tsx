import { Card } from '@/app/admin/components/Card';
import { auth } from '@/auth';

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Welcome back, {session?.user?.name || session?.user?.email}. Here's an overview of your Enterprise CMS.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">--</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Content Types</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">--</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Media Assets</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">--</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">--</p>
        </Card>
      </div>
    </div>
  );
}
