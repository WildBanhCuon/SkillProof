import {
  DEFAULT_PHONE_COUNTRY_CODE,
  PHONE_COUNTRY_CODES,
} from '../../data/phoneCountryCodes';

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
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Phone
      </label>
      <div className="flex gap-2">
        <select
          className="w-32 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:bg-slate-950"
          value={countryCode || DEFAULT_PHONE_COUNTRY_CODE}
          disabled={disabled}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          aria-label="Country code"
        >
          {PHONE_COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
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
        Select your country code, then enter your number without the leading zero.
      </p>
    </div>
  );
}
