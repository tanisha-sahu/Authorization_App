// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function (req, res, next) {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ message: 'No token provided' });

  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // confirm token matches what’s in the DB
    const user = await User.findById(payload.userId);
    if (!user || user.accessToken !== token) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
