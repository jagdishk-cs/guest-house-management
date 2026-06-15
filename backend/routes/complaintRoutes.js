import express from 'express';
import {
  getComplaints,
  createComplaint,
  updateComplaint,
  resolveComplaint,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);
router.route('/').get(asyncHandler(getComplaints)).post(asyncHandler(createComplaint));
router.patch('/:id/resolve', asyncHandler(resolveComplaint));
router.route('/:id').put(asyncHandler(updateComplaint)).delete(asyncHandler(deleteComplaint));

export default router;
