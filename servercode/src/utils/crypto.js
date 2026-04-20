const crypto = require('crypto');
const { TOKEN_EXPIRY } = require('../config/constants');

/**
 * Generate a 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a secure random token
 */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculate token expiry date
 * @param {boolean} rememberMe - Whether "Remember Me" was checked
 * @returns {Date} Expiry timestamp
 */
function getTokenExpiry(rememberMe = false) {
  const now = new Date();
  const expiry = new Date(now.getTime());

  if (rememberMe) {
    expiry.setTime(expiry.getTime() + TOKEN_EXPIRY.REMEMBER_ME);
  } else {
    expiry.setTime(expiry.getTime() + TOKEN_EXPIRY.REGULAR);
  }

  return expiry;
}

module.exports = {
  generateOTP,
  generateToken,
  getTokenExpiry
};