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
              ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-80'
              : value.includes(opt.key)
                ? 'border-indigo-200 bg-indigo-50/50'
                : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600"
            checked={value.includes(opt.key)}
            disabled={disabled}
            onChange={() => toggle(opt.key)}
          />
          <span className="min-w-0 flex-1">
            <span className="font-medium text-slate-900">{opt.label}</span>
            {opt.hint && (
              <span className="mt-0.5 block text-sm text-slate-500">{opt.hint}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
}
