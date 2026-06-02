/** Common dial codes for the profile phone field (E.164 prefix). */
export const PHONE_COUNTRY_CODES = [
  { code: '+32', label: 'BE +32' },
  { code: '+33', label: 'FR +33' },
  { code: '+31', label: 'NL +31' },
  { code: '+49', label: 'DE +49' },
  { code: '+44', label: 'UK +44' },
  { code: '+1', label: 'US/CA +1' },
  { code: '+34', label: 'ES +34' },
  { code: '+39', label: 'IT +39' },
  { code: '+41', label: 'CH +41' },
  { code: '+352', label: 'LU +352' },
  { code: '+351', label: 'PT +351' },
  { code: '+48', label: 'PL +48' },
  { code: '+46', label: 'SE +46' },
  { code: '+47', label: 'NO +47' },
  { code: '+45', label: 'DK +45' },
  { code: '+353', label: 'IE +353' },
  { code: '+43', label: 'AT +43' },
  { code: '+81', label: 'JP +81' },
  { code: '+86', label: 'CN +86' },
  { code: '+91', label: 'IN +91' },
  { code: '+61', label: 'AU +61' },
  { code: '+212', label: 'MA +212' },
  { code: '+216', label: 'TN +216' },
  { code: '+213', label: 'DZ +213' },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = '+32';

export function formatPhoneDisplay(
  countryCode: string | null | undefined,
  phone: string | null | undefined,
): string | null {
  const code = countryCode?.trim();
  const num = phone?.trim();
  if (!code && !num) return null;
  if (!code) return num ?? null;
  if (!num) return code;
  return `${code} ${num}`;
}
