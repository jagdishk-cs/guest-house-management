import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useStoreRevision } from '../../context/DataContext';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const revision = useStoreRevision();

  useEffect(() => {
    let cancelled = false;
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setOffline(data.database !== 'connected');
      })
      .catch(() => {
        if (!cancelled) setOffline(true);
      });
    return () => {
      cancelled = true;
    };
  }, [revision]);

  if (!offline) return null;

  return (
    <div className="mx-4 mb-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 lg:mx-0">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      <p>
        <strong>Database offline.</strong> Changes will not be saved until the backend and MongoDB are
        running. Start backend with <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">npm run dev</code>{' '}
        in the <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">backend</code> folder.
      </p>
    </div>
  );
}
