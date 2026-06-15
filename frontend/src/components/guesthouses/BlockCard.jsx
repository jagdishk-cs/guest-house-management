import { motion } from 'framer-motion';
import { Building2, Users, DoorOpen, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BlockCard({ block, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card group overflow-hidden transition hover:shadow-soft"
    >
      <div className="bg-gradient-brand p-4 text-white">
        <div className="flex items-center gap-3">
          <Building2 size={28} />
          <div>
            <h3 className="text-lg font-bold">{block.blockName}</h3>
            <p className="text-sm text-white/80">{block.name}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        <Stat label="Total" value={block.totalRooms} icon={DoorOpen} color="text-indigo-500" />
        <Stat label="Occupied" value={block.occupied} icon={Users} color="text-red-500" />
        <Stat label="Vacant" value={block.vacant} icon={DoorOpen} color="text-emerald-500" />
        <Stat label="Maint." value={block.maintenance} icon={Wrench} color="text-amber-500" />
      </div>
      <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <Link
          to={`/blueprint?block=${block._id}`}
          className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View Blueprint →
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, icon: Icon, color }) {
  return (
    <div className="text-center">
      <Icon className={`mx-auto mb-1 ${color}`} size={18} />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
