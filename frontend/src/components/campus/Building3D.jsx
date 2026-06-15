import { motion } from 'framer-motion';
import { Building2, Home } from 'lucide-react';
import { CAMPUS_ZONES } from './campusConfig';
import RoomCard from './RoomCard';

/**
 * Isometric-style building block with room segments on the roof face.
 */
export default function Building3D({
  zoneKey,
  rooms = [],
  capacity = 4,
  activeRoomId,
  onRoomSelect,
  onRoomHover,
  compact = false,
  className = '',
}) {
  const meta = CAMPUS_ZONES[zoneKey] || { label: zoneKey, accent: 'from-slate-500 to-slate-700', type: 'guest' };
  const slots = Array.from({ length: capacity }, (_, i) => rooms[i] || null);
  const isBachelor = meta.type === 'bachelor';
  const Icon = isBachelor ? Building2 : Home;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`group relative ${className}`}
    >
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="campus-building"
      >
        {/* Roof / room deck */}
        <div
          className={`campus-building-roof bg-gradient-to-br ${meta.accent} ${
            isBachelor ? 'px-1.5 py-2 sm:px-2' : 'px-2 py-2.5'
          }`}
        >
          <div className={`flex gap-0.5 sm:gap-1 ${isBachelor ? 'flex-nowrap' : 'flex-wrap justify-center'}`}>
            {slots.map((room, i) => (
              <RoomCard
                key={room?._id || `slot-${i}`}
                room={room}
                compact={compact || isBachelor}
                active={activeRoomId === room?._id}
                onSelect={onRoomSelect}
                onHover={onRoomHover}
              />
            ))}
          </div>
        </div>

        {/* Front face */}
        <div className={`campus-building-face bg-gradient-to-b ${meta.accent} opacity-90`}>
          <div className="flex h-full flex-col items-center justify-center gap-0.5 px-1 text-white">
            <Icon size={isBachelor ? 16 : 14} className="opacity-90" />
            <span className="text-center text-[9px] font-bold leading-tight sm:text-[10px]">
              {meta.label.replace('Bachelor Quarter ', 'BQ ').replace('Guest House ', 'GH ')}
            </span>
          </div>
        </div>

        {/* Side face */}
        <div className="campus-building-side bg-gradient-to-b from-black/25 to-black/45" />
      </motion.div>
    </motion.div>
  );
}

/** Non-interactive facility block (Gym, Water Tank) */
export function Facility3D({ label, sublabel, icon: Icon, accent = 'from-cyan-600 to-teal-800', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`campus-building ${className}`}
    >
      <div className={`campus-building-roof flex items-center justify-center bg-gradient-to-br ${accent} py-3`}>
        <Icon className="text-white/90" size={20} />
      </div>
      <div className={`campus-building-face bg-gradient-to-b ${accent}`}>
        <div className="flex h-full flex-col items-center justify-center text-center text-white">
          <span className="text-[9px] font-bold sm:text-[10px]">{label}</span>
          {sublabel && <span className="text-[8px] opacity-75">{sublabel}</span>}
        </div>
      </div>
      <div className="campus-building-side bg-gradient-to-b from-black/20 to-black/40" />
    </motion.div>
  );
}
