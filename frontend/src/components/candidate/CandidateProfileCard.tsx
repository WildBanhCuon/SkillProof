import { ExternalLink } from 'lucide-react';
import type { CandidateProfileData } from '../../data/profileFields';
import { profileFieldLabel } from '../../data/profileFields';
import { formatPhoneDisplay } from '../../data/phoneCountryCodes';
import { Card } from '../ui/Card';

const LINK_KEYS = [
  'linkedInUrl',
  'portfolioUrl',
  'githubUrl',
  'websiteUrl',
  'resumeUrl',
] as const;

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

export function CandidateProfileCard({
  profile,
  email,
  requiredFields,
}: {
  profile: CandidateProfileData;
  email?: string;
  requiredFields?: string[];
}) {
  const links = LINK_KEYS.filter((k) => profile[k]?.trim());

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">Candidate profile</h2>
      {requiredFields && requiredFields.length > 0 && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
          Required for this job:{' '}
          {requiredFields.map((f) => profileFieldLabel(f)).join(', ')}
        </p>
      )}

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Name
          </dt>
          <dd className="mt-0.5 text-slate-900 dark:text-slate-100">{profile.displayName || '—'}</dd>
        </div>
        {email && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Email
            </dt>
            <dd className="mt-0.5 text-slate-900 dark:text-slate-100">{email}</dd>
          </div>
        )}
        {(profile.phoneFormatted ||
          formatPhoneDisplay(profile.phoneCountryCode, profile.phone)) && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Phone
            </dt>
            <dd className="mt-0.5 text-slate-900 dark:text-slate-100">
              {profile.phoneFormatted ??
                formatPhoneDisplay(profile.phoneCountryCode, profile.phone)}
            </dd>
          </div>
        )}
        {profile.bio && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Bio
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-slate-800 dark:text-slate-200">{profile.bio}</dd>
          </div>
        )}
        {links.length > 0 && (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 dark:text-slate-500">
              Links
            </dt>
            <dd className="mt-1 flex flex-col gap-1">
              {links.map((key) => (
                <ProfileLink
                  key={key}
                  href={profile[key]!}
                  label={profileFieldLabel(key)}
                />
              ))}
            </dd>
          </div>
        )}
      </dl>

      {!profile.bio &&
        !profile.phoneFormatted &&
        !formatPhoneDisplay(profile.phoneCountryCode, profile.phone) &&
        links.length === 0 && (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
            The candidate has not filled in additional profile details yet.
          </p>
        )}
    </Card>
  );
}
