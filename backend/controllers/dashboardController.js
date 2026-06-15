import Room from '../models/Room.js';
import Resident from '../models/Resident.js';
import Complaint from '../models/Complaint.js';
import GuestHouse from '../models/GuestHouse.js';
import { getRecentActivities } from '../utils/activityLogger.js';

/** @route GET /api/dashboard/stats */
export const getDashboardStats = async (req, res) => {
  const [total, occupied, vacant, maintenance] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ status: 'occupied' }),
    Room.countDocuments({ status: 'vacant' }),
    Room.countDocuments({ status: 'maintenance' }),
  ]);

  const openComplaints = await Complaint.countDocuments({
    status: { $in: ['open', 'in_progress'] },
  });
  const totalResidents = await Resident.countDocuments({ isActive: true });
  const totalBlocks = await GuestHouse.countDocuments();

  // Occupancy chart — live counts (last 6 month labels; snapshot from current DB state)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    chartData.push({
      month: monthNames[d.getMonth()],
      occupied,
      vacant,
    });
  }

  res.json({
    success: true,
    stats: {
      totalRooms: total,
      occupiedRooms: occupied,
      vacantRooms: vacant,
      maintenanceRooms: maintenance,
      openComplaints,
      totalResidents,
      totalBlocks,
      vacancyRate: total ? Math.round((vacant / total) * 100) : 0,
    },
    chartData,
    recentActivity: await getRecentActivities(8),
  });
};
