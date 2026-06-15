import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    guestHouse: { type: mongoose.Schema.Types.ObjectId, ref: 'GuestHouse' },
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);
