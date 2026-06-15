import express from 'express';
import {
  getGuestHouses,
  getGuestHouse,
  createGuestHouse,
  updateGuestHouse,
  deleteGuestHouse,
} from '../controllers/guestHouseController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();
router.use(protect);
router.route('/').get(asyncHandler(getGuestHouses)).post(asyncHandler(createGuestHouse));
router
  .route('/:id')
  .get(asyncHandler(getGuestHouse))
  .put(asyncHandler(updateGuestHouse))
  .delete(asyncHandler(deleteGuestHouse));

export default router;
