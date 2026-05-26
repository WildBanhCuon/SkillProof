import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import {
  CandidateProfileData,
  EMPTY_PROFILE,
  profileFieldLabel,
  type ProfileFieldKey,
} from '../../data/profileFields';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../data/phoneCountryCodes';
import {
  candidateProfilePatchBody,
  missingRequiredProfileFields,
} from '../../utils/candidateProfile';
import { formatApiError } from '../../utils/errors';
import { PhoneFields } from './PhoneFields';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';

interface ProfileResponse {
  email: string;
  profile: CandidateProfileData;
}

export function ApplyRequiredProfileForm({
  jobId,
  jobTitle,
  requiredFields,
  onCancel,
  onComplete,
}: {
  jobId: string;
  jobTitle: string;
  requiredFields: ProfileFieldKey[];
  onCancel: () => void;
  onComplete: () => void | Promise<void>;
}) {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CandidateProfileData>(EMPTY_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api.get<ProfileResponse>('/candidate/profile');
        if (cancelled) return;
        const p = data.profile;
        setForm({
          displayName: p.displayName?.trim() || user?.fullName || '',
          bio: p.bio ?? '',
          phoneCountryCode: p.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE,
          phone: p.phone ?? '',
          linkedInUrl: p.linkedInUrl ?? '',
          portfolioUrl: p.portfolioUrl ?? '',
          githubUrl: p.githubUrl ?? '',
          websiteUrl: p.websiteUrl ?? '',
          resumeUrl: p.resumeUrl ?? '',
        });
      } catch (e) {
        if (!cancelled) {
          setError(formatApiError(e, 'Load profile'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.fullName]);

  const missing = useMemo(
    () => missingRequiredProfileFields(requiredFields, form),
    [requiredFields, form],
  );

  const set = (key: keyof CandidateProfileData, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (missing.length > 0) return;
    setError('');
    setSaving(true);
    try {
      await api.patch('/candidate/profile', candidateProfilePatchBody(form));
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      await queryClient.invalidateQueries({ queryKey: ['job', jobId, 'public'] });
      await onComplete();
    } catch (err) {
      setError(formatApiError(err, 'Save profile'));
    } finally {
      setSaving(false);
    }
  };

  const renderField = (key: ProfileFieldKey) => {
    const isMissing = missing.includes(key);
    const label = (
      <span className="mb-1 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {profileFieldLabel(key)}
        </span>
        <Badge variant={isMissing ? 'danger' : 'success'}>
          {isMissing ? 'Required' : 'Provided'}
        </Badge>
      </span>
    );

    switch (key) {
      case 'displayName':
        return (
          <div key={key}>
            {label}
            <Input
              value={form.displayName}
              onChange={(e) => set('displayName', e.target.value)}
              required
              minLength={2}
            />
          </div>
        );
      case 'bio':
        return (
          <div key={key}>
            {label}
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              rows={4}
              value={form.bio ?? ''}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Brief professional summary"
              required
            />
          </div>
        );
      case 'phone':
        return (
          <div key={key}>
            {label}
            <PhoneFields
              countryCode={form.phoneCountryCode ?? DEFAULT_PHONE_COUNTRY_CODE}
              phone={form.phone ?? ''}
              onCountryCodeChange={(code) => set('phoneCountryCode', code)}
              onPhoneChange={(value) => set('phone', value)}
            />
          </div>
        );
      case 'linkedInUrl':
        return (
          <div key={key}>
            {label}
            <Input
              type="url"
              value={form.linkedInUrl ?? ''}
              onChange={(e) => set('linkedInUrl', e.target.value)}
              placeholder="https://linkedin.com/in/…"
              required
            />
          </div>
        );
      case 'portfolioUrl':
        return (
          <div key={key}>
            {label}
            <Input
              type="url"
              value={form.portfolioUrl ?? ''}
              onChange={(e) => set('portfolioUrl', e.target.value)}
              placeholder="https://…"
              required
            />
          </div>
        );
      case 'githubUrl':
        return (
          <div key={key}>
            {label}
            <Input
              type="url"
              value={form.githubUrl ?? ''}
              onChange={(e) => set('githubUrl', e.target.value)}
              placeholder="https://github.com/…"
              required
            />
          </div>
        );
      case 'websiteUrl':
        return (
          <div key={key}>
            {label}
            <Input
              type="url"
              value={form.websiteUrl ?? ''}
              onChange={(e) => set('websiteUrl', e.target.value)}
              required
            />
          </div>
        );
      case 'resumeUrl':
        return (
          <div key={key}>
            {label}
            <Input
              type="url"
              value={form.resumeUrl ?? ''}
              onChange={(e) => set('resumeUrl', e.target.value)}
              placeholder="https://… (PDF or hosted CV)"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="mt-6 border-indigo-200 p-6 dark:border-indigo-800">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        Profile for this application
      </h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        <span className="font-medium">{jobTitle}</span> requires the fields below
        before you start the assessment. You can review and edit anything already
        on your profile.
      </p>

      {error && (
        <div className="mt-4">
          <Alert onDismiss={() => setError('')}>{error}</Alert>
        </div>
      )}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Loading your profile…
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          {requiredFields.map((key) => renderField(key))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="submit"
              disabled={saving || missing.length > 0 || form.displayName.trim().length < 2}
            >
              {saving ? 'Saving…' : 'Continue to assessment'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
              Cancel
            </Button>
          </div>
          {missing.length > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fill in all required fields to continue.
            </p>
          )}
        </form>
      )}
    </Card>
  );
}
