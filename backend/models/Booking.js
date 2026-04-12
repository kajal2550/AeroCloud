const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  flight: {
    type: mongoose.Schema.ObjectId,
    ref: 'Flight',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  passengerName: {
    type: String,
    required: [true, 'Please provide passenger name']
  },
  seats: {
    type: Number,
    required: [true, 'Please provide number of seats'],
    min: 1
  },
  seatNumber: {
    type: String,
    required: [true, 'Please provide a seat number']
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  hasCheckedIn: {
    type: Boolean,
    default: false
  },
  meal: {
    type: String,
    default: 'Standard Veg'
  },
  baggage: {
    type: String,
    default: '15kg (Included)'
  },
  priorityBoarding: {
    type: Boolean,
    default: false
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
