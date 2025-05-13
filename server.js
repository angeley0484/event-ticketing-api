// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import utility functions
const { generateQRCode } = require('./utils/qrUtils');
const { sendEmailConfirmation } = require('./utils/emailUtils');
const { getBookingMetrics } = require('./utils/adminUtils');

// Import route files
const eventRoutes = require('./routes/eventRoutes');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-ticketing';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/events', eventRoutes);

// Endpoint to generate a QR Code
app.post('/generate-qrcode', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Missing bookingId in request body' });
  }

  const bookingURL = `https://yourdomain.com/booking/${bookingId}`;

  try {
    const qrCode = await generateQRCode(bookingURL);
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error('❌ QR Code generation error:', err);
    res.status(500).json({ error: 'QR Code generation failed' });
  }
});

// Endpoint to send email confirmation
app.post('/send-email', async (req, res) => {
  const { email, bookingDetails } = req.body;

  if (!email || !bookingDetails) {
    return res.status(400).json({ error: 'Missing email or booking details' });
  }

  try {
    await sendEmailConfirmation(email, bookingDetails);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('❌ Email sending error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Admin metrics endpoint
app.get('/admin/metrics', async (req, res) => {
  try {
    const metrics = await getBookingMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    console.error('❌ Metrics fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// 404 Fallback Handler
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ error: '404 Not Found' });
  } else {
    res.status(404).type('txt').send('404 Not Found');
  }
});

// MongoDB connection and server start
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
