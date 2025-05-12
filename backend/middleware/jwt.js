// middleware/jwt.js
const jwt    = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// generate a short-lived JWT
function signAccessToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

// verify incoming JWT
function verifyAccessToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
