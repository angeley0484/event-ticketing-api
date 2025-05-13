const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/verifyToken'); // JWT middleware
const router = express.Router();

// Email transporter (configure securely in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your Gmail
    pass: 'your-email-password'    // Use App Password for Gmail
  }
});

// Send confirmation email
const sendConfirmationEmail = (userEmail, bookingDetails) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Ticket Booking Confirmation',
    text: `Your booking is confirmed!\n\nEvent: ${bookingDetails.eventName}\nDate: ${bookingDetails.eventDate}\nTickets: ${bookingDetails.ticketsBooked}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// 🔐 POST /api/bookings/:eventId/book - Book tickets for an event
router.post('/:eventId/book', verifyToken, async (req, res) => {
  const { eventId } = req.params;
  const { ticketsBooked } = req.body;
  const userId = req.userId; // from verifyToken middleware
  const userEmail = req.userEmail;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.bookedSeats + ticketsBooked > event.totalSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Update booked seats
    event.bookedSeats += ticketsBooked;
    await event.save();

    // Save booking
    const booking = new Booking({
      userId,
      eventId,
      ticketsBooked,
      bookingDate: new Date()
    });
    await booking.save();

    // Send email
    sendConfirmationEmail(userEmail, {
      eventName: event.name,
      eventDate: event.date,
      ticketsBooked
    });

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 🔐 GET /api/bookings - Return all bookings for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).populate('eventId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// 🔐 GET /api/bookings/:id - Return specific booking (only for that user)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('eventId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
});

module.exports = router;
