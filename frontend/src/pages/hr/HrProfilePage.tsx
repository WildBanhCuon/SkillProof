import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { formatApiError } from '../../utils/errors';
import { GenerateTeamProfileButton } from '../../components/hr/GenerateTeamProfileButton';

export function HrProfilePage() {
  const { user, refreshUser } = useAuth();
  const [teamProfile, setTeamProfile] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTeamProfile(user?.companyTeamProfile ?? '');
    setWebsiteUrl(user?.companyWebsiteUrl ?? '');
  }, [user?.companyTeamProfile, user?.companyWebsiteUrl]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.patch('/auth/company-profile', {
        teamProfile: teamProfile.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
      });
      await refreshUser();
      setSuccess('Company profile saved. New job postings will use this text by default.');
    } catch (err) {
      setError(formatApiError(err, 'Save company profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
        <Link to="/hr/jobs" className="hover:text-indigo-600 dark:text-indigo-400">
          Jobs
        </Link>{' '}
        / Company profile
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Company profile</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
        This description is reused when you create job postings with Guided setup.
      </p>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}
      {success && (
        <div className="mt-4">
          <Alert variant="success" onDismiss={() => setSuccess('')}>
            {success}
          </Alert>
        </div>
      )}

      <Card className="mt-6 p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Your name"
            value={user?.fullName ?? ''}
            readOnly
            className="bg-slate-50 dark:bg-slate-950"
          />
          <Input
            label="Company"
            value={user?.companyName ?? ''}
            readOnly
            className="bg-slate-50 dark:bg-slate-950"
          />
          <Input
            label="Company website"
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://www.yourcompany.com"
          />
          <div className="flex flex-wrap items-center gap-2">
            <GenerateTeamProfileButton
              companyName={user?.companyName ?? ''}
              websiteUrl={websiteUrl}
              onGenerated={({ teamProfile: draft, websiteUrl: normalized }) => {
                setTeamProfile(draft);
                setWebsiteUrl(normalized);
                setSuccess(
                  'Draft generated from your website — review and edit before saving.',
                );
              }}
              onError={setError}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
              We read public pages on your site (home, about, etc.) and draft text with AI.
              Always review before saving.
            </p>
          </div>
          <label className="block w-full">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              About your team and product
            </span>
            <textarea
              required
              rows={6}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              value={teamProfile}
              onChange={(e) => setTeamProfile(e.target.value)}
              placeholder="Describe your company, product, and the team the hire will join. This is prefilled in the job creation wizard."
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Minimum 10 characters. You can still tweak this per job in the wizard.
            </p>
          </label>
          <Button type="submit" disabled={saving || teamProfile.trim().length < 10}>
            {saving ? 'Saving…' : 'Save profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
