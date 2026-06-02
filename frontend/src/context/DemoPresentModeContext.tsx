import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getDemoPresentMode,
  setDemoPresentMode,
  subscribeDemoPresentMode,
} from '../utils/demoPresentMode';

type DemoPresentModeContextValue = {
  enabled: boolean;
  toggle: () => void;
  setEnabled: (value: boolean) => void;
};

const DemoPresentModeContext = createContext<DemoPresentModeContextValue | null>(
  null,
);

export function DemoPresentModeProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(() => getDemoPresentMode());

  useEffect(() => subscribeDemoPresentMode(setEnabledState), []);

  const setEnabled = useCallback((value: boolean) => {
    setDemoPresentMode(value);
    setEnabledState(value);
  }, []);

  const toggle = useCallback(() => {
    setEnabled(!getDemoPresentMode());
  }, [setEnabled]);

  const value = useMemo(
    () => ({ enabled, toggle, setEnabled }),
    [enabled, toggle, setEnabled],
  );

  return (
    <DemoPresentModeContext.Provider value={value}>
      {children}
    </DemoPresentModeContext.Provider>
  );
}

export function useDemoPresentMode(): DemoPresentModeContextValue {
  const ctx = useContext(DemoPresentModeContext);
  if (!ctx) {
    throw new Error('useDemoPresentMode must be used within DemoPresentModeProvider');
  }
  return ctx;
}
