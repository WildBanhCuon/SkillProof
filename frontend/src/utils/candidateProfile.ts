import type {
  CandidateProfileData,
  ProfileFieldKey,
} from '../data/profileFields';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../data/phoneCountryCodes';

export function isPhoneComplete(
  form: Pick<CandidateProfileData, 'phoneCountryCode' | 'phone'>,
): boolean {
  return !!(form.phoneCountryCode?.trim() && form.phone?.trim());
}

export function missingRequiredProfileFields(
  required: ProfileFieldKey[],
  form: CandidateProfileData,
): ProfileFieldKey[] {
  return required.filter((key) => {
    if (key === 'phone') return !isPhoneComplete(form);
    const v = form[key as keyof CandidateProfileData];
    return v == null || String(v).trim() === '';
  });
}

export function candidateProfilePatchBody(form: CandidateProfileData) {
  return {
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
  };
}
