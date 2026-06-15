import express from 'express';
import {
  getResidents,
  getResident,
  createResident,
  updateResident,
  deleteResident,
} from '../controllers/residentController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);
router.route('/').get(asyncHandler(getResidents)).post(asyncHandler(createResident));
router
  .route('/:id')
  .get(asyncHandler(getResident))
  .put(asyncHandler(updateResident))
  .delete(asyncHandler(deleteResident));

export default router;
