// utils/token.js
const crypto = require('crypto');
function genRememberToken() {
  return crypto.randomBytes(32).toString('hex');
}
module.exports = { genRememberToken };
