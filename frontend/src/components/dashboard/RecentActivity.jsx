import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function RecentActivity({ activities = [] }) {
  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="text-indigo-500" size={20} />
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <ul className="space-y-3">
        {activities.length === 0 ? (
          <li className="text-sm text-slate-500">No recent activity</li>
        ) : (
          activities.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
            >
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{item.action}</p>
                {item.details && (
                  <p className="text-xs text-slate-500">{item.details}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </motion.li>
          ))
        )}
      </ul>
    </div>
  );
}
