import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function VacancyCounter({ vacant, total }) {
  const [display, setDisplay] = useState(0);
  const rate = total ? Math.round((vacant / total) * 100) : 0;

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(vacant / 30) || 1;
    const timer = setInterval(() => {
      start += step;
      if (start >= vacant) {
        setDisplay(vacant);
        clearInterval(timer);
      } else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [vacant]);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass-card relative overflow-hidden p-6"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10" />
      <p className="text-sm font-medium text-slate-500">Live Vacancy Counter</p>
      <div className="mt-2 flex items-end gap-2">
        <motion.span
          key={display}
          className="text-5xl font-bold text-emerald-600 dark:text-emerald-400"
        >
          {display}
        </motion.span>
        <span className="mb-2 text-slate-500">rooms vacant</span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>Vacancy Rate</span>
          <span className="font-semibold">{rate}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${rate}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
          />
        </div>
      </div>
    </motion.div>
  );
}
