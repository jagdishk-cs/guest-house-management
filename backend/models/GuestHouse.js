import mongoose from 'mongoose';

const guestHouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    blockName: { type: String, required: true, trim: true },
    address: { type: String, default: '' },
    floors: { type: Number, default: 1 },
    description: { type: String, default: '' },
    campusZone: {
      type: String,
      enum: ['gh1', 'gh2', 'gh3', 'bqa', 'bqb'],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('GuestHouse', guestHouseSchema);
