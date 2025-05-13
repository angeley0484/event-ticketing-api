const nodemailer = require('nodemailer');

// Use your actual SMTP setup or a service like SendGrid
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use a service like Gmail for SMTP
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

const sendEmailConfirmation = async (email, bookingDetails) => {
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: email,
    subject: 'Booking Confirmation',
    text: `Booking Details: ${bookingDetails}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error('Failed to send email');
  }
};

module.exports = { sendEmailConfirmation };
