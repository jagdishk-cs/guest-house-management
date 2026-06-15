import { motion } from 'framer-motion';
import RoomCell from './RoomCell';

/** Grid floor map from room gridRow/gridCol positions */
export default function FloorBlueprint({ rooms = [], onRoomClick }) {
  if (!rooms.length) {
    return (
      <div className="glass-card flex h-64 items-center justify-center text-slate-500">
        No rooms in this block
      </div>
    );
  }

  const maxRow = Math.max(...rooms.map((r) => r.gridRow || 0));
  const maxCol = Math.max(...rooms.map((r) => r.gridCol || 0));
  const grid = Array.from({ length: maxRow + 1 }, () =>
    Array.from({ length: maxCol + 1 }, () => null)
  );
  rooms.forEach((r) => {
    grid[r.gridRow || 0][r.gridCol || 0] = r;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-6"
    >
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <Legend color="bg-emerald-500" label="Vacant" />
        <Legend color="bg-red-500" label="Occupied" />
        <Legend color="bg-amber-400" label="Maintenance" />
      </div>
      <div
        className="inline-grid gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-900/50"
        style={{
          gridTemplateColumns: `repeat(${maxCol + 1}, minmax(72px, 1fr))`,
        }}
      >
        {grid.flat().map((room, i) =>
          room ? (
            <RoomCell key={room._id} room={room} onClick={onRoomClick} />
          ) : (
            <div key={`empty-${i}`} className="min-h-[72px] rounded-xl bg-slate-100/50 dark:bg-slate-800/30" />
          )
        )}
      </div>
    </motion.div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  );
}
