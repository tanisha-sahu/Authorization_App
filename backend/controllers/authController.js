const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
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
};

exports.login = async (req, res) => {
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
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

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
};

exports.autoLogin = async (req, res) => {
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
};

exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'No token provided' });

  try {
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
};
