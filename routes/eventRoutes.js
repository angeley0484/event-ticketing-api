const express = require('express');
const router = express.Router();
const Event = require('../models/Event');  // Assuming you have the Event model

// Route to get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Route to get a single event by ID
router.get('/:id', async (req, res) => {
  const eventId = req.params.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Route to filter events by category (optional)
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const events = await Event.find({ category });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events by category' });
  }
});

// Route to filter events by date (optional)
router.get('/date/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const events = await Event.find({ date });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events by date' });
  }
});

module.exports = router;
