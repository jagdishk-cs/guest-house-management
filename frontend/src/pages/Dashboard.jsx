import { useEffect, useState } from 'react';
import { DoorOpen, Users, Wrench, Building2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import StatCard from '../components/ui/StatCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import CampusPreview from '../components/campus/CampusPreview';
import VacancyCounter from '../components/dashboard/VacancyCounter';
import OccupancyChart from '../components/dashboard/OccupancyChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import { dashboardAPI } from '../services/api';
import { useStoreRevision } from '../context/DataContext';

const PIE_COLORS = ['#10b981', '#ef4444', '#fbbf24'];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const revision = useStoreRevision();

  useEffect(() => {
    setLoading(true);
    dashboardAPI
      .stats()
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, [revision]);

  if (loading) {
    return (
      <div className="space-y-6">
        <CampusPreview />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const s = data?.stats || {};
  const pieData = [
    { name: 'Vacant', value: s.vacantRooms || 0 },
    { name: 'Occupied', value: s.occupiedRooms || 0 },
    { name: 'Maintenance', value: s.maintenanceRooms || 0 },
  ];

  return (
    <div className="space-y-6">
      <CampusPreview />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Rooms" value={s.totalRooms} icon={DoorOpen} color="bg-indigo-500" delay={0} />
        <StatCard title="Occupied" value={s.occupiedRooms} icon={Users} color="bg-red-500" delay={0.1} />
        <StatCard title="Vacant" value={s.vacantRooms} icon={DoorOpen} color="bg-emerald-500" delay={0.2} />
        <StatCard title="Maintenance" value={s.maintenanceRooms} icon={Wrench} color="bg-amber-500" delay={0.3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OccupancyChart data={data?.chartData} />
        </div>
        <VacancyCounter vacant={s.vacantRooms} total={s.totalRooms} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-1">
          <h3 className="mb-4 font-semibold">Room Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2">
          <RecentActivity activities={data?.recentActivity} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat icon={Building2} label="Total Blocks" value={s.totalBlocks} />
        <MiniStat icon={Users} label="Active Residents" value={s.totalResidents} />
        <MiniStat icon={Wrench} label="Open Complaints" value={s.openComplaints} />
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="glass-card flex items-center gap-4 p-4">
      <Icon className="text-indigo-500" size={24} />
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
