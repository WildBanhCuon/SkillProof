import type { ProfileFieldKey } from '../../data/profileFields';
import { PROFILE_FIELD_OPTIONS } from '../../data/profileFields';

export function ProfileRequirementsEditor({
  value,
  onChange,
  disabled,
}: {
  value: ProfileFieldKey[];
  onChange: (next: ProfileFieldKey[]) => void;
  disabled?: boolean;
}) {
  const toggle = (key: ProfileFieldKey) => {
    if (disabled) return;
    if (value.includes(key)) {
      onChange(value.filter((k) => k !== key));
    } else {
      onChange([...value, key]);
    }
  };

  return (
    <div className="space-y-2">
      {PROFILE_FIELD_OPTIONS.map((opt) => (
        <label
          key={opt.key}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
            disabled
              ? 'cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 opacity-80'
              : value.includes(opt.key)
                ? 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50/50'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 dark:border-slate-600'
          }`}
        >
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400"
            checked={value.includes(opt.key)}
            disabled={disabled}
            onChange={() => toggle(opt.key)}
          />
          <span className="min-w-0 flex-1">
            <span className="font-medium text-slate-900 dark:text-slate-100">{opt.label}</span>
            {opt.hint && (
              <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{opt.hint}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
