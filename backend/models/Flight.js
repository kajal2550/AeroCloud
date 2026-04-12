const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Please add a flight number'],
    unique: true,
    trim: true,
    maxlength: [10, 'Flight number cannot be more than 10 characters']
  },
  airline: {
    type: String,
    required: [true, 'Please add an airline name']
  },
  origin: {
    type: String,
    required: [true, 'Please add an origin city or airport']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination city or airport']
  },
  departureTime: {
    type: Date,
    required: [true, 'Please add a departure time']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Please add an arrival time']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please add total seats']
  },
  availableSeats: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled'],
    default: 'On Time'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Flight', FlightSchema);
