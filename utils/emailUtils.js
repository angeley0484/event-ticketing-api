const nodemailer = require('nodemailer');

// Create reusable transporter object using default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',  // Replace with your email
    pass: 'your-email-password',  // Replace with your email password
  },
});

// Send email
const sendEmailConfirmation = async (email, bookingDetails) => {
  try {
    await transporter.sendMail({
      from: '"Event Booking" <your-email@gmail.com>',
      to: email,
      subject: 'Booking Confirmation',
      text: `Your booking is confirmed! Details: ${bookingDetails}`,
    });
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Error sending email');
  }
};

module.exports = { sendEmailConfirmation };
