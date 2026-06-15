import { useEffect, useState } from 'react';
import { Database, Wifi, WifiOff } from 'lucide-react';
import { useStoreRevision } from '../../context/DataContext';

/** Shows live API + MongoDB status so users know data is persisting centrally. */
export default function ConnectionStatus() {
  const [status, setStatus] = useState({ api: false, database: false, host: null });
  const revision = useStoreRevision();

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        if (!cancelled) {
          setStatus({
            api: res.ok,
            database: data.database === 'connected',
            host: data.host,
          });
        }
      } catch {
        if (!cancelled) setStatus({ api: false, database: false, host: null });
      }
    };

    check();
    const id = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [revision]);

  const ok = status.api && status.database;
  const isLocal = status.host === '127.0.0.1' || status.host === 'localhost';

  return (
    <div
      className={`hidden items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium sm:flex ${
        ok
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
          : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
      }`}
      title={
        ok
          ? isLocal
            ? 'Saved to local MongoDB on this PC. Use MongoDB Atlas for the same data on every device.'
            : 'Connected to shared database — changes sync for all users.'
          : 'Database offline — changes will not be saved.'
      }
    >
      {ok ? <Wifi size={14} /> : <WifiOff size={14} />}
      <Database size={14} />
      <span>{ok ? (isLocal ? 'Local DB' : 'Cloud DB') : 'Offline'}</span>
    </div>
  );
}
