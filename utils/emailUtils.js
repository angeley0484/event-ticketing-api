const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Optional: verify transporter setup
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ Transporter config failed:', err);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

const sendEmailConfirmation = async (email, bookingDetails) => {
  const { eventName, eventDate, seatNumber } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🎫 Your Concert Booking Confirmation',
    text: `Hello!

Your booking has been confirmed.

Event: ${eventName}
Date: ${eventDate}
Seat: ${seatNumber}

Thank you for your purchase!
`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('❌ Email send failed:', err); // Log full error
    throw new Error('Failed to send email: ' + err.message);
  }
};

module.exports = { sendEmailConfirmation };
