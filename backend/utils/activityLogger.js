import Activity from '../models/Activity.js';

const MAX = 50;

/** Persist activity to MongoDB */
export const logActivity = async (action, details = '') => {
  try {
    await Activity.create({ action, details, timestamp: new Date() });
    const count = await Activity.countDocuments();
    if (count > MAX) {
      const oldest = await Activity.find().sort({ timestamp: 1 }).limit(count - MAX).select('_id');
      await Activity.deleteMany({ _id: { $in: oldest.map((a) => a._id) } });
    }
  } catch (err) {
    console.error('Activity log failed:', err.message);
  }
};

export const getRecentActivities = async (limit = 10) => {
  const rows = await Activity.find().sort({ timestamp: -1 }).limit(limit).lean();
  return rows.map((a) => ({
    action: a.action,
    details: a.details,
    timestamp: a.timestamp,
  }));
};
