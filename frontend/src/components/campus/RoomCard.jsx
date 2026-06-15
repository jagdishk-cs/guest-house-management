import { motion, AnimatePresence } from 'framer-motion';
import { ROOM_STATUS } from '../../utils/constants';

const glow = {
  vacant: 'shadow-[0_0_12px_rgba(16,185,129,0.65)] ring-emerald-400/60 bg-emerald-500',
  occupied: 'shadow-[0_0_14px_rgba(239,68,68,0.75)] ring-red-400/70 bg-red-500',
  maintenance: 'shadow-[0_0_10px_rgba(251,191,36,0.6)] ring-amber-400/60 bg-amber-400',
};

export default function RoomCard({ room, active, onSelect, onHover, compact = false }) {
  if (!room) {
    return (
      <div
        className={`rounded-md border border-dashed border-slate-300/40 bg-slate-200/30 dark:border-slate-600/40 dark:bg-slate-800/30 ${
          compact ? 'h-3 min-w-[10px] flex-1' : 'h-8 min-w-[18px] flex-1'
        }`}
      />
    );
  }

  const status = room.status || 'vacant';
  const style = glow[status] || glow.vacant;
  const pulse = status === 'occupied';

  return (
    <motion.button
      type="button"
      layout
      whileHover={{ scale: 1.15, zIndex: 20 }}
      whileTap={{ scale: 0.92 }}
      animate={pulse ? { boxShadow: ['0 0 8px rgba(239,68,68,0.5)', '0 0 16px rgba(239,68,68,0.9)', '0 0 8px rgba(239,68,68,0.5)'] } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : {}}
      onClick={() => onSelect?.(room)}
      onMouseEnter={() => onHover?.(room)}
      onMouseLeave={() => onHover?.(null)}
      className={`relative rounded-md ring-2 transition ${style} ${
        compact ? 'h-3 min-w-[10px] flex-1' : 'h-7 min-w-[14px] flex-1 sm:h-8 sm:min-w-[16px]'
      } ${active ? 'ring-white ring-offset-2 ring-offset-indigo-600' : ''}`}
      title={`${room.roomNumber} — ${ROOM_STATUS[status]?.label}`}
      aria-label={`Room ${room.roomNumber}, ${ROOM_STATUS[status]?.label}`}
    />
  );
}

export function RoomTooltip({ room, position }) {
  if (!room) return null;
  const status = room.status || 'vacant';
  const label = ROOM_STATUS[status]?.label || status;
  const checkIn = room.joiningDate
    ? new Date(room.joiningDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 4, scale: 0.96 }}
        className="pointer-events-none absolute z-50 min-w-[180px] rounded-xl border border-white/30 bg-slate-900/95 px-3 py-2.5 text-xs text-white shadow-2xl backdrop-blur-md"
        style={position ? { left: position.x, top: position.y } : undefined}
      >
        <p className="font-bold text-sm">{room.roomNumber}</p>
        <p className="mt-1 text-slate-300">
          Status:{' '}
          <span
            className={
              status === 'vacant'
                ? 'text-emerald-400'
                : status === 'occupied'
                  ? 'text-red-400'
                  : 'text-amber-400'
            }
          >
            {label}
          </span>
        </p>
        {room.resident?.name && (
          <p className="mt-0.5 text-slate-200">Resident: {room.resident.name}</p>
        )}
        {checkIn && <p className="mt-0.5 text-slate-400">Check-in: {checkIn}</p>}
      </motion.div>
    </AnimatePresence>
  );
}
