export type ProfileFieldKey =
  | 'displayName'
  | 'bio'
  | 'phone'
  | 'linkedInUrl'
  | 'portfolioUrl'
  | 'githubUrl'
  | 'websiteUrl'
  | 'resumeUrl';

export const PROFILE_FIELD_OPTIONS: {
  key: ProfileFieldKey;
  label: string;
  hint?: string;
}[] = [
  { key: 'displayName', label: 'Full name' },
  {
    key: 'bio',
    label: 'Bio / summary',
    hint: 'Short professional introduction',
  },
  { key: 'phone', label: 'Phone number' },
  { key: 'linkedInUrl', label: 'LinkedIn profile' },
  { key: 'portfolioUrl', label: 'Portfolio' },
  { key: 'githubUrl', label: 'GitHub' },
  { key: 'websiteUrl', label: 'Personal website' },
  {
    key: 'resumeUrl',
    label: 'Resume (link)',
    hint: 'URL to PDF or hosted CV (Google Drive, Notion, etc.)',
  },
];

/** Shown as locked-on in the HR editor (not stored in requiredProfileFields). */
export const ALWAYS_REQUIRED_PROFILE_DISPLAY = [
  {
    key: 'displayName' as const,
    label: 'Full name',
    hint: 'Always required for every application',
  },
  {
    key: 'email' as const,
    label: 'Email address',
    hint: 'From the candidate account — always required',
  },
];

export const OPTIONAL_PROFILE_FIELD_OPTIONS = PROFILE_FIELD_OPTIONS.filter(
  (o) => o.key !== 'displayName',
);

export function normalizeRequiredProfileFields(
  fields: ProfileFieldKey[] | undefined | null,
): ProfileFieldKey[] {
  const set = new Set<ProfileFieldKey>(['displayName', ...(fields ?? [])]);
  return PROFILE_FIELD_OPTIONS.map((o) => o.key).filter((k) => set.has(k));
}

export function profileFieldLabel(key: string): string {
  return (
    PROFILE_FIELD_OPTIONS.find((o) => o.key === key)?.label ?? key
  );
}

export interface CandidateProfileData {
  displayName: string;
  bio: string | null;
  phoneCountryCode: string | null;
  phone: string | null;
  phoneFormatted?: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  resumeUrl: string | null;
}

export const EMPTY_PROFILE: CandidateProfileData = {
  displayName: '',
  bio: null,
  phoneCountryCode: null,
  phone: null,
  linkedInUrl: null,
  portfolioUrl: null,
  githubUrl: null,
  websiteUrl: null,
  resumeUrl: null,
};
