import GuestHouse from '../models/GuestHouse.js';
import Room from '../models/Room.js';
import { logActivity } from '../utils/activityLogger.js';
import { pickFields } from '../utils/sanitize.js';

const GUEST_HOUSE_FIELDS = ['name', 'blockName', 'address', 'floors', 'description', 'campusZone'];

/** @route GET /api/guest-houses */
export const getGuestHouses = async (req, res) => {
  const houses = await GuestHouse.find().sort({ createdAt: -1 });
  const withStats = await Promise.all(
    houses.map(async (house) => {
      const rooms = await Room.find({ guestHouse: house._id });
      return {
        ...house.toObject(),
        totalRooms: rooms.length,
        occupied: rooms.filter((r) => r.status === 'occupied').length,
        vacant: rooms.filter((r) => r.status === 'vacant').length,
        maintenance: rooms.filter((r) => r.status === 'maintenance').length,
      };
    })
  );
  res.json({ success: true, data: withStats });
};

/** @route GET /api/guest-houses/:id */
export const getGuestHouse = async (req, res) => {
  const house = await GuestHouse.findById(req.params.id);
  if (!house) return res.status(404).json({ success: false, message: 'Not found' });
  const rooms = await Room.find({ guestHouse: house._id }).populate('resident', 'name phone');
  res.json({ success: true, data: { ...house.toObject(), rooms } });
};

/** @route POST /api/guest-houses */
export const createGuestHouse = async (req, res) => {
  const house = await GuestHouse.create(pickFields(req.body, GUEST_HOUSE_FIELDS));
  logActivity('Block Created', house.blockName);
  res.status(201).json({ success: true, data: house });
};

/** @route PUT /api/guest-houses/:id */
export const updateGuestHouse = async (req, res) => {
  const house = await GuestHouse.findByIdAndUpdate(req.params.id, pickFields(req.body, GUEST_HOUSE_FIELDS), {
    new: true,
    runValidators: true,
  });
  if (!house) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: house });
};

/** @route DELETE /api/guest-houses/:id */
export const deleteGuestHouse = async (req, res) => {
  const house = await GuestHouse.findByIdAndDelete(req.params.id);
  if (!house) return res.status(404).json({ success: false, message: 'Not found' });
  await Room.deleteMany({ guestHouse: req.params.id });
  res.json({ success: true, message: 'Deleted' });
};
