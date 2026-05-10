'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { Card } from '@/app/admin/components/Card';

type ContentType = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
};

export default function ContentTypesPage() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const fetchContentTypes = async () => {
    try {
      const res = await fetch('/api/cms/content-types');
      if (res.ok) {
        const data = await res.json();
        setContentTypes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/cms/content-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });

      if (res.ok) {
        const newType = await res.json();
        setContentTypes([newType, ...contentTypes]);
        setIsCreating(false);
        setName('');
        setSlug('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create content type');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const autoGenerateSlug = (value: string) => {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Content Types</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Define the structure of your content.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>{isCreating ? 'Cancel' : '+ New Content Type'}</Button>
      </div>

      {isCreating && (
        <Card className="border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold">Create New Content Type</h2>
          <form onSubmit={handleCreate} className="max-w-md space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => autoGenerateSlug(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                placeholder="e.g., Blog Post"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">API ID (Slug)</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                placeholder="e.g., blog-post"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full justify-center">
              Create Model
            </Button>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contentTypes.length === 0 && !isCreating && (
            <div className="col-span-full rounded-lg border border-dashed border-gray-300 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">No content types found. Create your first one!</p>
            </div>
          )}
          {contentTypes.map((ct) => (
            <Card
              key={ct.id}
              className="border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ct.name}</h3>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Model
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                API ID: <code className="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-900">{ct.slug}</code>
              </p>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm dark:border-gray-700">
                <span className="text-gray-500">Created {new Date(ct.createdAt).toLocaleDateString()}</span>
                <button className="font-medium text-blue-600 hover:text-blue-500">Edit Schema →</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
