const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  date: {
    type: Date,
    required: true
  },
  location: String,
  seatCapacity: {
    type: Number,
    required: true
  },
  bookedSeats: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Event', eventSchema);
