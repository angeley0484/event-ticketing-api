const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// ✅ FIXED import paths (removed the duplicate folder name)
const { generateQRCode } = require('./utils/qrUtils');
const { sendEmailConfirmation } = require('./utils/emailUtils');
const { getBookingMetrics } = require('./utils/adminUtils');

// ✅ FIXED route import path
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/event-ticketing';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Event API routes
app.use('/api/events', eventRoutes);

// Route to generate QR code for booking
app.post('/generate-qrcode', async (req, res) => {
  const bookingURL = 'https://yourdomain.com/booking/' + req.body.bookingId;
  try {
    const qrCode = await generateQRCode(bookingURL);
    res.status(200).send({ qrCode });
  } catch (err) {
    res.status(500).send({ error: 'QR Code generation failed' });
  }
});

// Route to send email confirmation
app.post('/send-email', async (req, res) => {
  const { email, bookingDetails } = req.body;
  try {
    await sendEmailConfirmation(email, bookingDetails);
    res.status(200).send('Email sent');
  } catch (err) {
    res.status(500).send('Failed to send email');
  }
});

// Route for admin metrics (Dashboard/Analytics)
app.get('/admin/metrics', async (req, res) => {
  try {
    const metrics = await getBookingMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).send('Failed to fetch metrics');
  }
});

// Catch-all 404 handler
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
