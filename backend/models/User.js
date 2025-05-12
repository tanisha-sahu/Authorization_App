// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  otp: String,
});

module.exports = mongoose.model('User', UserSchema);
// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email:    { type: String, unique: true },
  password: String,
  otp:           String,
  accessToken:   String,
  rememberToken: String,
});

module.exports = mongoose.model('User', userSchema);
