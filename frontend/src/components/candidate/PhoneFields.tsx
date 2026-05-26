import {
  DEFAULT_PHONE_COUNTRY_CODE,
} from '../../data/phoneCountryCodes';
import {
  getCountryCallingCode,
  getCountries,
  type CountryCode,
} from 'libphonenumber-js';

function isoToFlagEmoji(iso2: string): string {
  // Convert ISO-3166 alpha-2 code to regional indicator symbols.
  const code = iso2.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  const A = 'A'.charCodeAt(0);
  return String.fromCodePoint(...code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - A));
}

function isoToCountryName(iso2: string): string {
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return dn.of(iso2.toUpperCase()) ?? iso2.toUpperCase();
  } catch {
    return iso2.toUpperCase();
  }
}

function callingCodeToIsoOptions(callingCode: string): CountryCode[] {
  const normalized = callingCode.trim().replace(/^\+/, '+');
  if (!normalized) return [];

  // Note: several countries can share a calling code (e.g. +1). We surface all of them.
  return getCountries().filter((iso) => {
    return `+${getCountryCallingCode(iso)}` === normalized;
  });
}

function firstIsoForCallingCode(
  callingCode: string,
): CountryCode | undefined {
  return callingCodeToIsoOptions(callingCode)[0];
}

export function PhoneFields({
  countryCode,
  phone,
  onCountryCodeChange,
  onPhoneChange,
  disabled,
}: {
  countryCode: string;
  phone: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneChange: (value: string) => void;
  disabled?: boolean;
}) {
  const callingCode = countryCode || DEFAULT_PHONE_COUNTRY_CODE;
  const selectedIso = firstIsoForCallingCode(callingCode);
  const allCountries = getCountries();

  const visibleOptions = allCountries
    .map((iso) => {
      const cc = `+${getCountryCallingCode(iso)}`;
      return { iso, cc, name: isoToCountryName(iso) };
    })
    .sort((a, b) => a.iso.localeCompare(b.iso));

  const selectedValue = selectedIso ?? visibleOptions[0]?.iso ?? '__none__';

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Phone
      </label>
      <div className="flex gap-2">
        <select
          className="w-56 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:bg-slate-950"
          value={selectedValue}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value === '__none__') return;
            const iso = e.target.value as CountryCode;
            onCountryCodeChange(`+${getCountryCallingCode(iso)}`);
          }}
          aria-label="Country code"
        >
          <option value="__none__" disabled>
            Select…
          </option>
          {visibleOptions.map(({ iso, cc, name }) => (
            <option key={iso} value={iso} title={`${cc}`}>
              {isoToFlagEmoji(iso)} {name}
            </option>
          ))}
        </select>
        <input
          type="tel"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 dark:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:bg-slate-950"
          value={phone}
          disabled={disabled}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="470 12 34 56"
          aria-label="Phone number"
        />
      </div>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        Select your country, then enter your number (no leading zero).
      </p>
    </div>
  );
}
