const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  otp: String,
  accessToken: String,
  rememberToken: String,
});

const User = mongoose.model('User', userSchema);

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'This email already exists' });
    }
    await User.create({ username, email, password });
    res.json({ message: 'User registered' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Login + OTP generation
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).send({ message: 'Invalid credentials' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    res.send({ message: 'OTP sent', otp }); // For testing purposes
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// OTP verification + Token generation
app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    // Generate JWT access token
    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Generate remember token (random string)
    const rememberToken = crypto.randomBytes(32).toString('hex');

    user.accessToken = accessToken;
    user.rememberToken = rememberToken;
    user.otp = null;
    await user.save();

    res.send({ accessToken, rememberToken, message: 'OTP Verified Successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Auto-login using rememberToken
app.get('/api/auth/auto-login', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(401).send({ message: 'No token provided' });

  try {
    const user = await User.findOne({ rememberToken: token });

    if (!user) return res.status(401).send({ message: 'Invalid remember token' });

    const newAccessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    user.accessToken = newAccessToken;
    await user.save();

    res.send({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});

// Logout: clear accessToken and rememberToken
app.post('/api/auth/logout', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'No token provided' });

  try {
    // Find user by rememberToken
    const user = await User.findOne({ rememberToken: token });

    if (!user) return res.status(401).send({ message: 'Invalid token' });

    user.accessToken = null;
    user.rememberToken = null;
    await user.save();

    res.send({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
});


// Server listen
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  