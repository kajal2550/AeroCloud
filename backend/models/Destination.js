const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  img: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Destination', DestinationSchema);
