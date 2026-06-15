import Resident from '../models/Resident.js';
import Room from '../models/Room.js';
import { logActivity } from '../utils/activityLogger.js';
import { pickFields } from '../utils/sanitize.js';

const RESIDENT_FIELDS = [
  'name',
  'phone',
  'poornataId',
  'designation',
  'department',
  'email',
  'idProof',
  'idProofType',
  'emergencyContact',
  'notes',
];

/** @route GET /api/residents */
export const getResidents = async (req, res) => {
  const filter = {};
  if (req.query.search) {
    const q = req.query.search;
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { poornataId: { $regex: q, $options: 'i' } },
      { department: { $regex: q, $options: 'i' } },
      { designation: { $regex: q, $options: 'i' } },
    ];
  }
  const residents = await Resident.find(filter)
    .populate({ path: 'currentRoom', populate: { path: 'guestHouse', select: 'blockName name' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: residents });
};

/** @route GET /api/residents/:id */
export const getResident = async (req, res) => {
  const resident = await Resident.findById(req.params.id)
    .populate('currentRoom')
    .populate('history.guestHouse', 'blockName name');
  if (!resident) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: resident });
};

/** @route POST /api/residents */
export const createResident = async (req, res) => {
  const resident = await Resident.create(pickFields(req.body, RESIDENT_FIELDS));
  logActivity('Resident Added', resident.name);
  res.status(201).json({ success: true, data: resident });
};

/** @route PUT /api/residents/:id */
export const updateResident = async (req, res) => {
  const body = pickFields(req.body, RESIDENT_FIELDS);
  const resident = await Resident.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  }).populate('currentRoom');
  if (!resident) return res.status(404).json({ success: false, message: 'Not found' });
  if (resident.currentRoom && body.department !== undefined) {
    await Room.findOneAndUpdate(
      { _id: resident.currentRoom, resident: resident._id },
      { department: body.department }
    );
  }
  res.json({ success: true, data: resident });
};

/** @route DELETE /api/residents/:id */
export const deleteResident = async (req, res) => {
  const resident = await Resident.findById(req.params.id);
  if (!resident) return res.status(404).json({ success: false, message: 'Not found' });
  if (resident.currentRoom) {
    await Room.findByIdAndUpdate(resident.currentRoom, {
      status: 'vacant',
      resident: null,
      joiningDate: null,
      department: '',
      rentStatus: 'pending',
    });
  }
  await resident.deleteOne();
  logActivity('Resident Removed', resident.name);
  res.json({ success: true, message: 'Deleted' });
};
