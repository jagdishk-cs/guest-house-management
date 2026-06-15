import express from 'express';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  markMaintenance,
  assignResident,
  vacateRoom,
  getRoomQR,
} from '../controllers/roomController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);
router.route('/').get(asyncHandler(getRooms)).post(asyncHandler(createRoom));
router.get('/:id/qrcode', asyncHandler(getRoomQR));
router.patch('/:id/maintenance', asyncHandler(markMaintenance));
router.patch('/:id/assign', asyncHandler(assignResident));
router.patch('/:id/vacate', asyncHandler(vacateRoom));
router
  .route('/:id')
  .get(asyncHandler(getRoom))
  .put(asyncHandler(updateRoom))
  .delete(asyncHandler(deleteRoom));

export default router;
