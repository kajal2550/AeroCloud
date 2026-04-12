const express = require('express');
const {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  getOccupiedSeats
} = require('../controllers/flightController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
const bookingRouter = require('./bookingRoutes');
router.use('/:flightId/bookings', bookingRouter);

router
  .route('/')
  .get(getFlights)
  .post(protect, authorize('admin'), createFlight);

router
  .route('/:id')
  .get(getFlight)
  .put(protect, authorize('admin'), updateFlight)
  .delete(protect, authorize('admin'), deleteFlight);

router.get('/:id/occupied-seats', getOccupiedSeats);

module.exports = router;
