import mongoose from 'mongoose';

const residentHistorySchema = new mongoose.Schema({
  roomNumber: String,
  guestHouse: { type: mongoose.Schema.Types.ObjectId, ref: 'GuestHouse' },
  joinDate: Date,
  leaveDate: Date,
  notes: String,
});

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    poornataId: { type: String, default: '', trim: true },
    designation: { type: String, default: '', trim: true },
    department: { type: String, default: '', trim: true },
    email: { type: String, default: '' },
    idProof: { type: String, default: '' },
    idProofType: { type: String, default: 'Aadhar' },
    emergencyContact: { type: String, default: '' },
    notes: { type: String, default: '' },
    currentRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
    history: [residentHistorySchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Resident', residentSchema);
