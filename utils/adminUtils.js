const Event = require('../models/Event');

const getBookingMetrics = async () => {
  try {
    const events = await Event.find();
    const totalBookings = events.reduce((sum, event) => sum + event.bookedSeats, 0);
    const totalEvents = events.length;
    const totalCapacity = events.reduce((sum, event) => sum + event.seatCapacity, 0);

    return {
      totalEvents,
      totalBookings,
      totalCapacity
    };
  } catch (err) {
    throw new Error('Failed to fetch booking metrics');
  }
};

module.exports = { getBookingMetrics };
