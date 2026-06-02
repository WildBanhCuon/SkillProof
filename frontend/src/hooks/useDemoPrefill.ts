import { useEffect } from 'react';
import { useDemoPresentMode } from '../context/DemoPresentModeContext';

/** Re-run apply when demo mode is toggled on or when deps change (e.g. wizard step). */
export function useDemoPrefill(apply: () => void, deps: unknown[] = []): void {
  const { enabled } = useDemoPresentMode();

  useEffect(() => {
    if (!enabled) return;
    apply();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply is caller-defined; deps listed explicitly
  }, [enabled, ...deps]);
}
