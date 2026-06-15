import QRCode from 'qrcode';
import Room from '../models/Room.js';
import Resident from '../models/Resident.js';
import { logActivity } from '../utils/activityLogger.js';
import { pickFields } from '../utils/sanitize.js';

const ROOM_CREATE_FIELDS = [
  'roomNumber',
  'guestHouse',
  'floor',
  'department',
  'rentAmount',
  'gridRow',
  'gridCol',
  'notes',
];
const ROOM_UPDATE_FIELDS = [...ROOM_CREATE_FIELDS, 'status', 'rentStatus'];

/** Build filter from query params */
const buildFilter = (query) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.guestHouse) filter.guestHouse = query.guestHouse;
  if (query.search) {
    filter.$or = [{ roomNumber: { $regex: query.search, $options: 'i' } }];
  }
  return filter;
};

/** @route GET /api/rooms */
export const getRooms = async (req, res) => {
  const filter = buildFilter(req.query);
  let rooms = await Room.find(filter)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident', 'name phone idProof poornataId designation department email')
    .sort({ roomNumber: 1 });

  if (req.query.resident) {
    const term = req.query.resident;
    rooms = rooms.filter(
      (r) => r.resident?.name?.toLowerCase().includes(term.toLowerCase())
    );
  }

  res.json({ success: true, data: rooms });
};

/** @route GET /api/rooms/:id */
export const getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  res.json({ success: true, data: room });
};

/** @route GET /api/rooms/:id/qrcode */
export const getRoomQR = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('guestHouse', 'blockName');
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  const payload = JSON.stringify({
    room: room.roomNumber,
    block: room.guestHouse?.blockName,
    status: room.status,
  });
  const qr = await QRCode.toDataURL(payload);
  res.json({ success: true, data: qr });
};

/** @route POST /api/rooms */
export const createRoom = async (req, res) => {
  const room = await Room.create(pickFields(req.body, ROOM_CREATE_FIELDS));
  const qr = await QRCode.toDataURL(`ROOM:${room.roomNumber}:${room._id}`);
  room.qrCode = qr;
  await room.save();
  logActivity('Room Added', room.roomNumber);
  const populated = await Room.findById(room._id)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  res.status(201).json({ success: true, data: populated });
};

/** @route PUT /api/rooms/:id */
export const updateRoom = async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, pickFields(req.body, ROOM_UPDATE_FIELDS), {
    new: true,
    runValidators: true,
  })
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  logActivity('Room Updated', room.roomNumber);
  res.json({ success: true, data: room });
};

/** @route DELETE /api/rooms/:id */
export const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  if (room.resident) {
    await Resident.findByIdAndUpdate(room.resident, { currentRoom: null });
  }
  await room.deleteOne();
  logActivity('Room Deleted', room.roomNumber);
  res.json({ success: true, message: 'Room deleted' });
};

/** @route PATCH /api/rooms/:id/maintenance */
export const markMaintenance = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  room.status = 'maintenance';
  room.resident = null;
  room.department = '';
  room.joiningDate = null;
  await room.save();
  logActivity('Maintenance', room.roomNumber);
  const populated = await Room.findById(room._id)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  res.json({ success: true, data: populated });
};

/** @route PATCH /api/rooms/:id/assign */
export const assignResident = async (req, res) => {
  const { residentId, joiningDate, rentStatus } = req.body;
  const room = await Room.findById(req.params.id);
  const resident = await Resident.findById(residentId);
  if (!room || !resident) {
    return res.status(404).json({ success: false, message: 'Room or resident not found' });
  }
  if (resident.currentRoom) {
    await Room.findByIdAndUpdate(resident.currentRoom, {
      status: 'vacant',
      resident: null,
      joiningDate: null,
      department: '',
    });
  }
  room.status = 'occupied';
  room.resident = residentId;
  room.department = resident.department || '';
  room.joiningDate = joiningDate || new Date();
  room.rentStatus = rentStatus || 'pending';
  await room.save();
  resident.currentRoom = room._id;
  resident.history.push({
    roomNumber: room.roomNumber,
    guestHouse: room.guestHouse,
    joinDate: room.joiningDate,
  });
  await resident.save();
  logActivity('Resident Assigned', `${resident.name} → ${room.roomNumber}`);
  const populated = await Room.findById(room._id)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  res.json({ success: true, data: populated });
};

/** @route PATCH /api/rooms/:id/vacate */
export const vacateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('resident');
  if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
  if (room.resident) {
    const resident = await Resident.findById(room.resident._id);
    if (resident) {
      const last = resident.history[resident.history.length - 1];
      if (last) last.leaveDate = new Date();
      resident.currentRoom = null;
      await resident.save();
    }
  }
  room.status = 'vacant';
  room.resident = null;
  room.department = '';
  room.joiningDate = null;
  room.rentStatus = 'pending';
  await room.save();
  logActivity('Room Vacated', room.roomNumber);
  const populated = await Room.findById(room._id)
    .populate('guestHouse', 'name blockName campusZone')
    .populate('resident');
  res.json({ success: true, data: populated });
};
