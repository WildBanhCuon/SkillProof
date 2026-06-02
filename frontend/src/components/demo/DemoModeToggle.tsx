import { useEffect, useState } from 'react';
import { useDemoPresentMode } from '../../context/DemoPresentModeContext';

/** Hidden control: fixed corner hotspot; brief toast on toggle. */
export function DemoModeToggle() {
  const { enabled, toggle } = useDemoPresentMode();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  const onToggle = () => {
    const next = !enabled;
    toggle();
    setToast(getDemoPresentModeLabel(next));
  };

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-label={enabled ? 'Disable demo prefill' : 'Enable demo prefill'}
        title={enabled ? 'Demo prefill: ON (click to turn off)' : 'Demo prefill: OFF (click to turn on)'}
        className={`fixed bottom-3 left-3 z-[100] h-4 w-4 rounded-full border transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
          enabled
            ? 'border-indigo-500 bg-indigo-500/30 opacity-40 hover:opacity-80'
            : 'border-transparent bg-transparent opacity-0 hover:border-slate-400/40 hover:bg-slate-400/10 hover:opacity-60'
        }`}
      />
      {toast && (
        <div
          role="status"
          className="fixed bottom-10 left-3 z-[100] max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          {toast}
        </div>
      )}
    </>
  );
}

function getDemoPresentModeLabel(willBeEnabled: boolean): string {
  return willBeEnabled
    ? 'Demo prefill ON — forms will auto-fill'
    : 'Demo prefill OFF';
}
