import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  getCountryCallingCode,
  getCountries,
  type CountryCode,
} from 'libphonenumber-js';

type CountryOption = {
  iso: CountryCode;
  cc: string;
  name: string;
  flag: string;
  searchText: string;
};

function isoToFlagEmoji(iso2: string): string {
  const code = iso2.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '🏳️';
  const A = 'A'.charCodeAt(0);
  return String.fromCodePoint(
    ...code.split('').map((c) => 0x1f1e6 + c.charCodeAt(0) - A),
  );
}

function isoToCountryName(iso2: string): string {
  try {
    const dn = new Intl.DisplayNames(['en'], { type: 'region' });
    return dn.of(iso2.toUpperCase()) ?? iso2.toUpperCase();
  } catch {
    return iso2.toUpperCase();
  }
}

function buildCountryOptions(): CountryOption[] {
  return getCountries()
    .map((iso) => {
      const cc = `+${getCountryCallingCode(iso)}`;
      const name = isoToCountryName(iso);
      return {
        iso,
        cc,
        name,
        flag: isoToFlagEmoji(iso),
        searchText: `${iso} ${name} ${cc} ${cc.replace('+', '')}`.toLowerCase(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_COUNTRY_OPTIONS = buildCountryOptions();

function firstIsoForCallingCode(callingCode: string): CountryCode | undefined {
  const normalized = callingCode.trim().replace(/^\+/, '+');
  if (!normalized) return undefined;
  return getCountries().find(
    (iso) => `+${getCountryCallingCode(iso)}` === normalized,
  );
}

function matchesCountryQuery(option: CountryOption, query: string): boolean {
  const q = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!q) return true;
  const qNoPlus = q.replace(/^\+/, '');
  return (
    option.searchText.includes(q) ||
    option.searchText.includes(qNoPlus) ||
    option.iso.toLowerCase().startsWith(q) ||
    option.name.toLowerCase().startsWith(q)
  );
}

function CountryCodeCombobox({
  countryCode,
  onCountryCodeChange,
  disabled,
}: {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  disabled?: boolean;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);

  const callingCode = countryCode.trim();
  const selectedIso = callingCode
    ? firstIsoForCallingCode(callingCode)
    : undefined;
  const selected = selectedIso
    ? ALL_COUNTRY_OPTIONS.find((o) => o.iso === selectedIso)
    : undefined;

  const filtered = useMemo(
    () => ALL_COUNTRY_OPTIONS.filter((o) => matchesCountryQuery(o, query)),
    [query],
  );

  useEffect(() => {
    if (!open) return;
    setHighlightIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const selectOption = (option: CountryOption) => {
    onCountryCodeChange(option.cc);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) setOpen(true);
      setHighlightIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const pick = filtered[highlightIndex];
      if (pick) selectOption(pick);
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const displayValue = open
    ? query
    : selected
      ? `${selected.flag} ${selected.name} (${selected.cc})`
      : '';

  return (
    <div ref={rootRef} className="relative w-56 shrink-0 sm:w-64">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Country code"
          disabled={disabled}
          value={displayValue}
          placeholder="Select country…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-950"
          onFocus={() => {
            setOpen(true);
            setQuery('');
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onInputKeyDown}
        />
        <ChevronDown
          className={`pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </div>

      {open && !disabled && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              No country found
            </li>
          ) : (
            filtered.map((option, index) => {
              const active = index === highlightIndex;
              const isSelected = option.iso === selected?.iso;
              return (
                <li key={option.iso} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm ${
                      active
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100'
                        : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => selectOption(option)}
                  >
                    <span className="shrink-0">{option.flag}</span>
                    <span className="min-w-0 flex-1 truncate">{option.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">
                      {option.cc}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
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
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Phone
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <CountryCodeCombobox
          countryCode={countryCode}
          onCountryCodeChange={onCountryCodeChange}
          disabled={disabled}
        />
        <input
          type="tel"
          className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-950"
          value={phone}
          disabled={disabled}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="470 12 34 56"
          aria-label="Phone number"
        />
      </div>
    </div>
  );
}
