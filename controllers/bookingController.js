const Booking = require('../models/Booking');
const Event = require('../models/Event');
const QRCode = require('qrcode');

exports.bookEvent = async (req, res) => {
  const { event: eventId, quantity } = req.body;

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (event.bookedSeats + quantity > event.seatCapacity) {
    return res.status(400).json({ error: 'Not enough seats available' });
  }

  const qrData = `${req.user._id}-${eventId}-${Date.now()}`;
  const qrCode = await QRCode.toDataURL(qrData);

  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    quantity,
    qrCode,
  });

  event.bookedSeats += quantity;
  await event.save();

  res.status(201).json({ message: 'Booking successful', booking });
};

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('event');
  res.json(bookings);
};

exports.getBookingById = async (req, res) => {
  const booking = await Booking.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('event');

  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
};

exports.validateQR = async (req, res) => {
  const booking = await Booking.findOne({ qrCode: req.params.qr });

  if (!booking) return res.status(404).json({ error: 'Invalid QR Code' });
  res.json({ message: 'Ticket valid', booking });
};
