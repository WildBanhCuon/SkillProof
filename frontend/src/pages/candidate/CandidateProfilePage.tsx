import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import {
  CandidateProfileData,
  EMPTY_PROFILE,
} from '../../data/profileFields';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../data/phoneCountryCodes';
import { PhoneFields } from '../../components/candidate/PhoneFields';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { formatApiError } from '../../utils/errors';

interface ProfileResponse {
  email: string;
  profile: CandidateProfileData;
  updatedAt: string | null;
}

export function CandidateProfilePage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const onboarding = searchParams.get('onboarding') === '1';
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_PROFILE);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: () => api.get<ProfileResponse>('/candidate/profile'),
  });

  useEffect(() => {
    if (data?.profile) {
      setForm({
        displayName: data.profile.displayName ?? '',
        bio: data.profile.bio ?? '',
        phoneCountryCode:
          data.profile.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE,
        phone: data.profile.phone ?? '',
        linkedInUrl: data.profile.linkedInUrl ?? '',
        portfolioUrl: data.profile.portfolioUrl ?? '',
        githubUrl: data.profile.githubUrl ?? '',
        websiteUrl: data.profile.websiteUrl ?? '',
        resumeUrl: data.profile.resumeUrl ?? '',
      });
    }
  }, [data]);

  const set = (key: keyof CandidateProfileData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await api.patch('/candidate/profile', {
        displayName: form.displayName.trim(),
        bio: form.bio?.trim() || '',
        phoneCountryCode: form.phone?.trim()
          ? form.phoneCountryCode?.trim() || DEFAULT_PHONE_COUNTRY_CODE
          : '',
        phone: form.phone?.trim() || '',
        linkedInUrl: form.linkedInUrl?.trim() || '',
        portfolioUrl: form.portfolioUrl?.trim() || '',
        githubUrl: form.githubUrl?.trim() || '',
        websiteUrl: form.websiteUrl?.trim() || '',
        resumeUrl: form.resumeUrl?.trim() || '',
      });
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      await queryClient.invalidateQueries({ queryKey: ['job'] });
      if (onboarding) {
        navigate('/jobs');
        return;
      }
      setSuccess('Profile saved.');
    } catch (err) {
      setError(formatApiError(err, 'Save profile'));
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading profile…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {onboarding ? 'Complete your profile' : 'Your profile'}
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {onboarding
          ? 'Add how employers should see you — you can fill in more details later.'
          : 'Employers may require some of these fields when you apply. Keep your profile up to date so you can start assessments without delays.'}
      </p>

      {onboarding && (
        <div className="mt-4">
          <Alert variant="info">
            Welcome! Enter your name to finish signing up, then browse open roles.
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
            label="Email"
            value={data?.email ?? ''}
            readOnly
            className="bg-slate-50 dark:bg-slate-950"
          />
          <Input
            label="Full name"
            value={form.displayName}
            onChange={(e) => set('displayName', e.target.value)}
            required
            minLength={2}
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Bio / summary
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={4}
              value={form.bio ?? ''}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Brief professional summary"
            />
          </div>
          <PhoneFields
            countryCode={form.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE}
            phone={form.phone ?? ''}
            onCountryCodeChange={(code) => set('phoneCountryCode', code)}
            onPhoneChange={(value) => set('phone', value)}
          />
          <Input
            label="LinkedIn"
            type="url"
            value={form.linkedInUrl ?? ''}
            onChange={(e) => set('linkedInUrl', e.target.value)}
            placeholder="https://linkedin.com/in/…"
          />
          <Input
            label="Portfolio"
            type="url"
            value={form.portfolioUrl ?? ''}
            onChange={(e) => set('portfolioUrl', e.target.value)}
            placeholder="https://…"
          />
          <Input
            label="GitHub"
            type="url"
            value={form.githubUrl ?? ''}
            onChange={(e) => set('githubUrl', e.target.value)}
            placeholder="https://github.com/…"
          />
          <Input
            label="Personal website"
            type="url"
            value={form.websiteUrl ?? ''}
            onChange={(e) => set('websiteUrl', e.target.value)}
          />
          <Input
            label="Resume (link)"
            type="url"
            value={form.resumeUrl ?? ''}
            onChange={(e) => set('resumeUrl', e.target.value)}
            placeholder="https://… (PDF or hosted CV)"
          />
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || form.displayName.trim().length < 2}>
              {saving
                ? 'Saving…'
                : onboarding
                  ? 'Continue to jobs'
                  : 'Save profile'}
            </Button>
            {onboarding && (
              <Link to="/jobs">
                <Button type="button" variant="outline">
                  Skip for now
                </Button>
              </Link>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
