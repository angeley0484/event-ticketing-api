const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET /api/events - Get all events or filter by category/date
router.get('/', async (req, res) => {
  try {
    const { category, date } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (date) filter.date = date;

    const events = await Event.find(filter);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

module.exports = router;
