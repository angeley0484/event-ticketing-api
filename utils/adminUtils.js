// Dummy function for metrics (you can replace this with actual logic)
const getBookingMetrics = async () => {
  try {
    // Example: Return fake booking data
    return {
      totalBookings: 120,
      activeUsers: 50,
    };
  } catch (err) {
    console.error('Error fetching metrics:', err);
    throw new Error('Error fetching metrics');
  }
};

module.exports = { getBookingMetrics };
