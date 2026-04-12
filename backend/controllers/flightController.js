const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const socketConfig = require('../socket');

// @desc    Get all flights (with optional query filters like origin, dest, date)
// @route   GET /api/flights
// @access  Public
exports.getFlights = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'minPrice', 'maxPrice'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      reqQuery.price = {};
      if (req.query.minPrice) reqQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) reqQuery.price.$lte = Number(req.query.maxPrice);
    }

    // Simple search for origin/dest matching
    if (reqQuery.origin) reqQuery.origin = { $regex: reqQuery.origin, $options: 'i' };
    if (reqQuery.destination) reqQuery.destination = { $regex: reqQuery.destination, $options: 'i' };

    // Date filtering: find flights on that specific day
    if (reqQuery.date) {
      const startOfDay = new Date(reqQuery.date);
      startOfDay.setUTCHours(0,0,0,0);
      const endOfDay = new Date(reqQuery.date);
      endOfDay.setUTCHours(23,59,59,999);
      
      reqQuery.departureTime = {
        $gte: startOfDay,
        $lte: endOfDay
      };
      delete reqQuery.date;
    }

    query = Flight.find(reqQuery);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('departureTime');
    }

    const flights = await query;
    res.status(200).json({ success: true, count: flights.length, data: flights });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
exports.getFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ success: false, error: 'Flight not found' });
    res.status(200).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Create new flight
// @route   POST /api/flights
// @access  Private (Admin)
exports.createFlight = async (req, res, next) => {
  try {
    req.body.availableSeats = req.body.totalSeats;
    const flight = await Flight.create(req.body);
    res.status(201).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update flight
// @route   PUT /api/flights/:id
// @access  Private (Admin)
exports.updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!flight) return res.status(404).json({ success: false, error: 'Flight not found' });
    
    // Emit real-time flight update
    try {
      socketConfig.getIO().emit('flightUpdated', flight);
    } catch(err) {
      console.error('Socket emit error:', err);
    }

    res.status(200).json({ success: true, data: flight });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete flight
// @route   DELETE /api/flights/:id
// @access  Private (Admin)
exports.deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ success: false, error: 'Flight not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get occupied seats for a flight
// @route   GET /api/flights/:id/occupied-seats
// @access  Public
exports.getOccupiedSeats = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ flight: req.params.id }).select('seatNumber');
    const occupiedSeats = bookings.map(b => b.seatNumber).filter(s => s);
    res.status(200).json({ success: true, data: occupiedSeats });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
