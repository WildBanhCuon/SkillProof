export const PROFILE_FIELD_KEYS = [
  'displayName',
  'bio',
  'phone',
  'linkedInUrl',
  'portfolioUrl',
  'githubUrl',
  'websiteUrl',
  'resumeUrl',
] as const;

export type ProfileFieldKey = (typeof PROFILE_FIELD_KEYS)[number];

export type CandidateProfileValues = {
  displayName: string;
  bio: string | null;
  phoneCountryCode: string | null;
  phone: string | null;
  linkedInUrl: string | null;
  portfolioUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  resumeUrl: string | null;
};

export function parseRequiredProfileFields(raw: unknown): ProfileFieldKey[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((k): k is ProfileFieldKey =>
    PROFILE_FIELD_KEYS.includes(k as ProfileFieldKey),
  );
}

export function profileValuesFromUser(
  displayName: string,
  profile: {
    bio: string | null;
    phoneCountryCode: string | null;
    phone: string | null;
    linkedInUrl: string | null;
    portfolioUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    resumeUrl: string | null;
  } | null,
): CandidateProfileValues {
  return {
    displayName,
    bio: profile?.bio ?? null,
    phoneCountryCode: profile?.phoneCountryCode ?? null,
    phone: profile?.phone ?? null,
    linkedInUrl: profile?.linkedInUrl ?? null,
    portfolioUrl: profile?.portfolioUrl ?? null,
    githubUrl: profile?.githubUrl ?? null,
    websiteUrl: profile?.websiteUrl ?? null,
    resumeUrl: profile?.resumeUrl ?? null,
  };
}

export function isPhoneComplete(values: CandidateProfileValues): boolean {
  return (
    !!values.phoneCountryCode?.trim() && !!values.phone?.trim()
  );
}

export function formatPhoneDisplay(
  countryCode: string | null,
  phone: string | null,
): string | null {
  const code = countryCode?.trim();
  const num = phone?.trim();
  if (!code && !num) return null;
  if (!code) return num ?? null;
  if (!num) return code;
  return `${code} ${num}`;
}

export function missingRequiredProfileFields(
  required: ProfileFieldKey[],
  values: CandidateProfileValues,
): ProfileFieldKey[] {
  return required.filter((key) => {
    if (key === 'phone') return !isPhoneComplete(values);
    const v = values[key];
    return v == null || String(v).trim() === '';
  });
}

export function profileForApi(values: CandidateProfileValues) {
  return {
    displayName: values.displayName,
    bio: values.bio,
    phoneCountryCode: values.phoneCountryCode,
    phone: values.phone,
    phoneFormatted: formatPhoneDisplay(
      values.phoneCountryCode,
      values.phone,
    ),
    linkedInUrl: values.linkedInUrl,
    portfolioUrl: values.portfolioUrl,
    githubUrl: values.githubUrl,
    websiteUrl: values.websiteUrl,
    resumeUrl: values.resumeUrl,
  };
}
