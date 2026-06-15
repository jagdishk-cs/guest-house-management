import Complaint from '../models/Complaint.js';
import { logActivity } from '../utils/activityLogger.js';

/** @route GET /api/complaints */
export const getComplaints = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const complaints = await Complaint.find(filter)
    .populate('resident', 'name phone')
    .populate('room', 'roomNumber')
    .populate('guestHouse', 'blockName')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: complaints });
};

/** @route POST /api/complaints */
export const createComplaint = async (req, res) => {
  const complaint = await Complaint.create(req.body);
  logActivity('Complaint Filed', complaint.title);
  const populated = await Complaint.findById(complaint._id)
    .populate('resident', 'name phone')
    .populate('room', 'roomNumber');
  res.status(201).json({ success: true, data: populated });
};

/** @route PUT /api/complaints/:id */
export const updateComplaint = async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
    .populate('resident', 'name phone')
    .populate('room', 'roomNumber');
  if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, data: complaint });
};

/** @route PATCH /api/complaints/:id/resolve */
export const resolveComplaint = async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    {
      status: 'resolved',
      resolvedAt: new Date(),
      resolvedBy: req.admin?.name || 'Admin',
    },
    { new: true }
  )
    .populate('resident', 'name phone')
    .populate('room', 'roomNumber');
  if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
  logActivity('Complaint Resolved', complaint.title);
  res.json({ success: true, data: complaint });
};

/** @route DELETE /api/complaints/:id */
export const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id);
  if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, message: 'Deleted' });
};
