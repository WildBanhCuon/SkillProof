const STORAGE_KEY = 'skillproof_demo_present_mode';

export const DEMO_PRESENT_MODE_EVENT = 'skillproof:demo-present-mode';

export function getDemoPresentMode(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

export function setDemoPresentMode(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  if (enabled) {
    window.localStorage.setItem(STORAGE_KEY, '1');
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(
    new CustomEvent(DEMO_PRESENT_MODE_EVENT, { detail: { enabled } }),
  );
}

export function subscribeDemoPresentMode(
  listener: (enabled: boolean) => void,
): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener(getDemoPresentMode());
  };
  const onCustom = (e: Event) => {
    const detail = (e as CustomEvent<{ enabled: boolean }>).detail;
    listener(detail?.enabled ?? getDemoPresentMode());
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(DEMO_PRESENT_MODE_EVENT, onCustom);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener(DEMO_PRESENT_MODE_EVENT, onCustom);
  };
}
