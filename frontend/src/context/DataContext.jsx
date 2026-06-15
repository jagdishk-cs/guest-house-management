import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { subscribe } from '../services/client';

const DataContext = createContext(null);

/**
 * Global data sync — any save to the store bumps `revision`
 * so every page/component reloads fresh data automatically.
 */
export function DataProvider({ children }) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    return subscribe(() => setRevision((r) => r + 1));
  }, []);

  // Reload from MongoDB when tab regains focus (keeps all pages in sync)
  useEffect(() => {
    const sync = () => setRevision((r) => r + 1);
    const onVisible = () => {
      if (document.visibilityState === 'visible') sync();
    };
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const bumpRevision = useCallback(() => setRevision((r) => r + 1), []);

  return (
    <DataContext.Provider value={{ revision, bumpRevision }}>
      {children}
    </DataContext.Provider>
  );
}

/** Re-run effects when any data changes anywhere in the app */
export function useStoreRevision() {
  const ctx = useContext(DataContext);
  return ctx?.revision ?? 0;
}

export function useDataSync() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataSync must be used within DataProvider');
  return ctx;
}
