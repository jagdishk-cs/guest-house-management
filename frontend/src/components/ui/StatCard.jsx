import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card group p-6 transition hover:shadow-soft"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
        <div
          className={`rounded-2xl p-3 ${color} text-white shadow-lg transition group-hover:scale-110`}
        >
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
}
