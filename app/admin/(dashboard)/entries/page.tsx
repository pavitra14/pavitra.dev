'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Card } from '@/app/admin/components/Card';
import Button from '@/components/ui/Button';
import { Trash2, Edit3, Eye, FileText, Plus } from 'lucide-react';
import matter from 'gray-matter';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function EntriesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [frontmatter, setFrontmatter] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    tags: '',
    draft: false,
    layout: 'PostLayout',
  });
  const [newSlug, setNewSlug] = useState('');
  const [activeTab, setActiveTab] = useState<'editor' | 'settings'>('editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/posts');
      const data = await res.json();
      if (data.posts) {
        setPosts(
          data.posts.sort((a: any, b: any) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPost = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cms/posts?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      setSelectedKey(key);
      const parsed = matter(data.content || '');
      setContent(parsed.content);
      setFrontmatter({
        title: parsed.data.title || '',
        date: parsed.data.date
          ? new Date(parsed.data.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        summary: parsed.data.summary || '',
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.join(', ') : parsed.data.tags || '',
        draft: parsed.data.draft || false,
        layout: parsed.data.layout || 'PostLayout',
      });
      setNewSlug(key.replace('blogs/', '').replace('.mdx', ''));
      setActiveTab('editor');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedKey(null);
    setContent('');
    setFrontmatter({
      title: 'New Post',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      tags: '',
      draft: true,
      layout: 'PostLayout',
    });
    setNewSlug('new-post');
    setActiveTab('settings');
  };

  const handleSavePost = async () => {
    if (!newSlug.trim()) return alert('Slug is required!');
    setSaving(true);
    const key = `blogs/${newSlug.replace(/[^a-zA-Z0-9-]/g, '')}.mdx`;
    const docData = {
      title: frontmatter.title,
      date: new Date(frontmatter.date).toISOString(),
      tags: frontmatter.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      draft: frontmatter.draft,
      summary: frontmatter.summary,
      layout: frontmatter.layout,
    };

    try {
      const res = await fetch('/api/cms/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, content: matter.stringify(content, docData) }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Post published');
        fetchPosts();
        if (!selectedKey) setSelectedKey(data.key);
      }
    } catch (err) {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete ${key}?`)) return;
    await fetch(`/api/cms/posts?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (selectedKey === key) {
      setSelectedKey(null);
      setContent('');
    }
    fetchPosts();
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Sidebar List */}
      <Card className="flex w-1/3 flex-col overflow-hidden bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">Content Entries</h2>
          <Button onClick={handleCreateNew} size="sm">
            <Plus size={16} className="mr-1" /> New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">Loading...</div>
          ) : (
            posts.map((post) => (
              <div
                key={post.key}
                onClick={() => handleSelectPost(post.key)}
                className={`group mb-1 flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${selectedKey === post.key ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'}`}
              >
                <div className="flex items-center gap-3 truncate">
                  <FileText size={16} className="shrink-0 opacity-70" />
                  <span className="truncate">{post.key.replace('blogs/', '').replace('.mdx', '')}</span>
                </div>
                <button
                  onClick={(e) => handleDeletePost(post.key, e)}
                  className="p-1 text-red-500 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Editor Area */}
      <Card className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-gray-800">
        {!selectedKey && !newSlug ? (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <FileText size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Select an entry or create a new one.</p>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-gray-50 px-6 dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'editor' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  <Edit3 size={16} /> Markdown Editor
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'settings' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Settings
                </button>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={`/blog/${newSlug}`}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <Eye size={16} /> Preview
                </a>
                <Button onClick={handleSavePost} disabled={saving}>
                  {saving ? 'Saving...' : 'Publish'}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {activeTab === 'editor' && (
                <div className="h-full p-4">
                  <div
                    data-color-mode="light"
                    className="h-full overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:hidden"
                  >
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      height="100%"
                      visibleDragbar={false}
                    />
                  </div>
                  <div
                    data-color-mode="dark"
                    className="hidden h-full overflow-hidden rounded-lg border border-gray-800 shadow-sm dark:block"
                  >
                    <MDEditor
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      height="100%"
                      visibleDragbar={false}
                      className="bg-[#0d1117]"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="mx-auto max-w-2xl space-y-6 p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                      <input
                        type="text"
                        value={frontmatter.title}
                        onChange={(e) => setFrontmatter({ ...frontmatter, title: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Slug</label>
                      <input
                        type="text"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publish Date</label>
                      <input
                        type="date"
                        value={frontmatter.date}
                        onChange={(e) => setFrontmatter({ ...frontmatter, date: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={frontmatter.tags}
                        onChange={(e) => setFrontmatter({ ...frontmatter, tags: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
                    <textarea
                      rows={4}
                      value={frontmatter.summary}
                      onChange={(e) => setFrontmatter({ ...frontmatter, summary: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Status</h4>
                      <p className="text-sm text-gray-500">Drafts are hidden from production.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={!frontmatter.draft}
                        onChange={(e) => setFrontmatter({ ...frontmatter, draft: !e.target.checked })}
                      />
                      <div className="peer h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-blue-600 peer-focus:ring-blue-500 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {frontmatter.draft ? 'Draft (Hidden)' : 'Published (Live)'}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
