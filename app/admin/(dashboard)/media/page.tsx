'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/app/admin/components/Card';
import Button from '@/components/ui/Button';
import { Upload, Trash2, Copy, Image as ImageIcon, FileText, Globe, Lock } from 'lucide-react';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024,
    dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MediaLibraryPage() {
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadIsPublic, setUploadIsPublic] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/media');
      const data = await res.json();
      if (data.media)
        setMediaList(
          data.media.sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        );
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', String(uploadIsPublic));

    try {
      const res = await fetch('/api/cms/media', { method: 'POST', body: formData });
      if (res.ok) fetchMedia();
      else alert('Failed to upload');
    } catch (err) {
      alert('Upload error');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteMedia = async (key: string) => {
    if (!confirm('Permanently delete this file?')) return;
    await fetch(`/api/cms/media?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
    fetchMedia();
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(`![Image](${url})`);
    alert('Markdown image copied to clipboard!');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Media Library</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Manage all your S3 assets globally.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={uploadIsPublic}
              onChange={(e) => setUploadIsPublic(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {uploadIsPublic ? (
              <>
                <Globe size={14} /> Public
              </>
            ) : (
              <>
                <Lock size={14} /> Private
              </>
            )}
          </label>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={16} className="mr-2" /> {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading Media...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {mediaList.map((file) => (
            <Card key={file.key} className="group flex flex-col overflow-hidden bg-white dark:bg-gray-800">
              <div className="relative flex h-40 shrink-0 items-center justify-center bg-gray-100 dark:bg-gray-900">
                {file.key.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ? (
                  <img src={file.url} className="h-full w-full object-cover" alt="" />
                ) : (
                  <FileText size={32} className="text-gray-400" />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="rounded-full bg-white p-2 text-gray-900 hover:bg-gray-200"
                    title="Copy Markdown Link"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(file.key)}
                    className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                    title="Delete File"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-between p-3">
                <div className="mb-1 truncate text-sm font-medium" title={file.key.replace('media/', '')}>
                  {file.key.replace('media/', '')}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatBytes(file.size)}</span>
                  <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          ))}
          {mediaList.length === 0 && (
            <div className="col-span-full p-12 text-center text-gray-500">No media uploaded yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
