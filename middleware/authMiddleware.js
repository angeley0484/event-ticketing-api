const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach full user (without password) to req
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      req.user = user;
      req.userId = user._id;         // ✅ For convenience
      req.userEmail = user.email;    // ✅ For sending emails

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Admin access only' });
  }
};

module.exports = { protect, adminOnly };
