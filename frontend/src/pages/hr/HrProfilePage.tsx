import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { api } from '../../api/client';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { formatApiError } from '../../utils/errors';
import { GenerateTeamProfileButton } from '../../components/hr/GenerateTeamProfileButton';
import { DeleteAccountSection } from '../../components/account/DeleteAccountSection';

export function HrProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const onboarding = searchParams.get('onboarding') === '1';

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [teamProfile, setTeamProfile] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? '');
    setCompanyName(user?.companyName ?? '');
    setTeamProfile(user?.companyTeamProfile ?? '');
    setWebsiteUrl(user?.companyWebsiteUrl ?? '');
  }, [
    user?.fullName,
    user?.companyName,
    user?.companyTeamProfile,
    user?.companyWebsiteUrl,
  ]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.patch('/auth/hr/profile', {
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        teamProfile: teamProfile.trim(),
        websiteUrl: websiteUrl.trim() || undefined,
      });
      await refreshUser();
      if (onboarding) {
        navigate('/hr/jobs');
        return;
      }
      setSuccess('Profile saved. New job postings will use this text by default.');
    } catch (err) {
      setError(formatApiError(err, 'Save profile'));
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    fullName.trim().length > 0 &&
    companyName.trim().length > 0 &&
    teamProfile.trim().length >= 10;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        <Link to="/hr/jobs" className="hover:text-indigo-600 dark:text-indigo-400">
          Jobs
        </Link>{' '}
        / Company profile
      </p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {onboarding ? 'Complete your profile' : 'Company profile'}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {onboarding
          ? 'A few details about you and your company — then you can create job postings.'
          : 'This description is reused when you create job postings with Guided setup.'}
      </p>

      {onboarding && (
        <div className="mt-4">
          <Alert variant="info">
            You&apos;re almost done. Add your name, company, and a short team description to
            continue.
          </Alert>
        </div>
      )}

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
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Company name"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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
              companyName={companyName}
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optional: draft “about your team” from your public website, then edit.
            </p>
          </div>
          <label className="block w-full">
            <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              About your team and product
            </span>
            <textarea
              required
              minLength={10}
              rows={6}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600"
              value={teamProfile}
              onChange={(e) => setTeamProfile(e.target.value)}
              placeholder="Describe your company, product, and the team the hire will join."
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Minimum 10 characters. You can still tweak this per job in the wizard.
            </p>
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || !canSave}>
              {saving
                ? 'Saving…'
                : onboarding
                  ? 'Continue to jobs'
                  : 'Save profile'}
            </Button>
            {onboarding && (
              <Link to="/hr/jobs">
                <Button type="button" variant="outline">
                  Skip for now
                </Button>
              </Link>
            )}
          </div>
        </form>
      </Card>

      {!onboarding && <DeleteAccountSection role="hr" />}
    </div>
  );
}
