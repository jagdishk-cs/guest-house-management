import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, trim: true },
    details: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

activitySchema.index({ timestamp: -1 });

export default mongoose.model('Activity', activitySchema);
