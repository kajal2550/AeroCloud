const express = require('express');
const {
  getBookings,
  getBooking,
  addBooking,
  cancelBooking,
  checkIn
} = require('../controllers/bookingController');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, addBooking);

router
  .route('/:id')
  .get(protect, getBooking)
  .delete(protect, cancelBooking);

router
  .route('/:id/checkin')
  .put(protect, checkIn);

module.exports = router;
