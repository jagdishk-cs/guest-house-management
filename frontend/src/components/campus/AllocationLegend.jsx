import { motion } from 'framer-motion';
import { DoorOpen, Users, Wrench, Circle } from 'lucide-react';

const items = [
  { key: 'available', color: 'bg-emerald-500', glow: 'shadow-[0_0_8px_rgba(16,185,129,0.6)]', label: 'Available', icon: Circle },
  { key: 'occupied', color: 'bg-red-500', glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]', label: 'Allocated / Occupied', icon: Users },
  { key: 'maintenance', color: 'bg-amber-400', glow: 'shadow-[0_0_8px_rgba(251,191,36,0.5)]', label: 'Maintenance', icon: Wrench },
];

export default function AllocationLegend({ stats }) {
  const { total = 0, occupied = 0, available = 0, maintenance = 0 } = stats || {};

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col gap-4"
    >
      <div className="glass-card p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Legend</h4>
        <ul className="space-y-2.5">
          {items.map(({ color, glow, label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <span className={`h-3 w-3 shrink-0 rounded-full ${color} ${glow}`} />
              <Icon size={14} className="text-slate-400" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <DoorOpen size={16} className="text-indigo-500" />
          Live Summary
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <StatPill label="Total Rooms" value={total} className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" />
          <StatPill label="Occupied" value={occupied} className="bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300" />
          <StatPill label="Available" value={available} className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" />
          <StatPill label="Maintenance" value={maintenance} className="bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300" />
        </div>
      </div>
    </motion.div>
  );
}

function StatPill({ label, value, className }) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${className}`}>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="text-[11px] font-medium opacity-80">{label}</p>
    </div>
  );
}
