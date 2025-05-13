const express = require('express');
const Booking = require('../models/Booking'); // Assuming Booking is a Mongoose model for bookings
const Event = require('../models/Event');
const nodemailer = require('nodemailer');
const verifyToken = require('../middleware/verifyToken'); // Assuming this middleware verifies the user
const router = express.Router();

// Create a transporter for sending email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your email
    pass: 'your-email-password'    // Replace with your email password
  }
});

// Function to send confirmation email
const sendConfirmationEmail = (userEmail, bookingDetails) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: userEmail,
    subject: 'Ticket Booking Confirmation',
    text: `Your booking is confirmed! Event: ${bookingDetails.eventName}, Date: ${bookingDetails.eventDate}, Tickets: ${bookingDetails.ticketsBooked}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Confirmation email sent: ' + info.response);
    }
  });
};

// Booking Route (updated to send email)
router.post('/:eventId/book', verifyToken, async (req, res) => {
  const { eventId } = req.params;
  const { ticketsBooked } = req.body;
  const userId = req.userId; // Assuming this is stored in the JWT token

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.bookedSeats + ticketsBooked > event.totalSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    event.bookedSeats += ticketsBooked;
    await event.save();

    // Create booking entry
    const booking = new Booking({
      userId,
      eventId,
      ticketsBooked,
      bookingDate: Date.now()
    });
    await booking.save();

    // Send confirmation email
    sendConfirmationEmail(req.userEmail, {
      eventName: event.name,
      eventDate: event.date,
      ticketsBooked: ticketsBooked
    });

    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
