import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import CampusMap from './CampusMap';
import AllocationLegend from './AllocationLegend';
import { groupRoomsByZone, computeCampusStats } from './campusConfig';
import { guestHouseAPI, roomAPI } from '../../services/api';
import { useStoreRevision } from '../../context/DataContext';
import { CardSkeleton } from '../ui/Skeleton';

export default function CampusPreview() {
  const [rooms, setRooms] = useState([]);
  const [guestHouses, setGuestHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const revision = useStoreRevision();

  useEffect(() => {
    setLoading(true);
    Promise.all([roomAPI.list(), guestHouseAPI.list()])
      .then(([roomsRes, ghRes]) => {
        setRooms(roomsRes.data.data || []);
        setGuestHouses(ghRes.data.data || []);
      })
      .catch(() => toast.error('Failed to load campus map'))
      .finally(() => setLoading(false));
  }, [revision]);

  const groupedRooms = useMemo(
    () => groupRoomsByZone(rooms, guestHouses),
    [rooms, guestHouses]
  );

  const stats = useMemo(() => computeCampusStats(rooms), [rooms]);

  if (loading) {
    return (
      <section className="space-y-4">
        <Header />
        <CardSkeleton />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Header live />

      <div className="glass-card overflow-hidden border-indigo-200/30 dark:border-indigo-800/40">
        <div className="border-b border-white/20 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 px-4 py-3 dark:border-slate-700/50 sm:px-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Interactive isometric campus — hover or tap any room for allocation details. Updates
            automatically when residents are assigned or vacated.
          </p>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[1fr_220px] lg:gap-6 lg:p-6">
          <CampusMap groupedRooms={groupedRooms} />
          <AllocationLegend stats={stats} />
        </div>
      </div>
    </motion.section>
  );
}

function Header({ live }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <Map size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Campus Preview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            3D smart-campus occupancy map
          </p>
        </div>
      </div>
      {live && (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
          Live data
        </span>
      )}
    </div>
  );
}
