import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },
    guestHouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GuestHouse',
      required: true,
    },
    floor: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ['vacant', 'occupied', 'maintenance'],
      default: 'vacant',
    },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', default: null },
    department: { type: String, default: '', trim: true },
    joiningDate: { type: Date, default: null },
    rentStatus: {
      type: String,
      enum: ['paid', 'pending', 'overdue'],
      default: 'pending',
    },
    rentAmount: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    // Blueprint grid position for floor map
    gridRow: { type: Number, default: 0 },
    gridCol: { type: Number, default: 0 },
    qrCode: { type: String, default: '' },
  },
  { timestamps: true }
);

roomSchema.index({ guestHouse: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model('Room', roomSchema);
