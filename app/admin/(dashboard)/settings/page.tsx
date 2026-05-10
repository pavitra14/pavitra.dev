'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/app/admin/components/Card';
import Button from '@/components/ui/Button';
import { Upload, Key } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

export default function SettingsPage() {
  const [homeSettings, setHomeSettings] = useState({
    resumeLink: '',
    description: '',
    pictureUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/cms/settings');
      const data = await res.json();
      if (data.settings) setHomeSettings({ ...homeSettings, ...data.settings });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await fetch('/api/cms/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: homeSettings }),
      });
      alert('Homepage settings saved');
    } catch (err) {
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldToUpdate: 'pictureUrl' | 'resumeLink'
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPublic', 'true');

    try {
      const res = await fetch('/api/cms/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setHomeSettings((prev) => ({ ...prev, [fieldToUpdate]: data.url }));
      } else {
        alert(data.error || 'Failed to upload');
      }
    } catch (err) {
      alert('Upload error');
    }
  };

  const handleRegisterPasskey = async () => {
    try {
      const optsRes = await fetch('/api/auth/webauthn/register-options');
      const options = await optsRes.json();

      if (options.error) throw new Error(options.error);

      const regResp = await startRegistration(options);

      const verifyRes = await fetch('/api/auth/webauthn/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regResp),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        alert('Passkey successfully registered!');
      } else {
        alert(verifyData.error || 'Failed to verify passkey');
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to register passkey: ' + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Manage global configurations.</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saving || loading}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className="space-y-8 bg-white p-8 dark:bg-gray-800">
        <div>
          <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-bold dark:border-gray-700">
            Homepage Profile
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Author / Home Picture URL
              </label>
              <div className="flex items-center gap-4">
                {homeSettings.pictureUrl && (
                  <img
                    src={homeSettings.pictureUrl}
                    alt="Avatar"
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                  />
                )}
                <input
                  type="text"
                  value={homeSettings.pictureUrl}
                  onChange={(e) => setHomeSettings({ ...homeSettings, pictureUrl: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="https://..."
                />
                <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <Upload size={16} className="mr-2" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'pictureUrl')}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resume Link (PDF)</label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={homeSettings.resumeLink}
                  onChange={(e) => setHomeSettings({ ...homeSettings, resumeLink: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  placeholder="https://..."
                />
                <label className="flex shrink-0 cursor-pointer items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                  <Upload size={16} className="mr-2" /> Upload
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, 'resumeLink')}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Short Description (Intro)
              </label>
              <textarea
                rows={5}
                value={homeSettings.description}
                onChange={(e) => setHomeSettings({ ...homeSettings, description: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-8 space-y-6 bg-white p-8 dark:bg-gray-800">
        <div>
          <h2 className="mb-6 flex items-center gap-2 border-b border-gray-200 pb-4 text-xl font-bold dark:border-gray-700">
            <Key size={20} className="text-gray-500" /> WebAuthn Passkeys
          </h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Register a biometric passkey (Touch ID, Face ID, Windows Hello) or hardware security key to sign in securely
            without typing the S3 key password.
          </p>
          <Button
            onClick={handleRegisterPasskey}
            className="bg-primary-600 hover:bg-primary-700 font-medium text-white"
          >
            Register New Passkey
          </Button>
        </div>
      </Card>
    </div>
  );
}
