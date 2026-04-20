const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/constants');

const resetPasswordLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: process.env.NODE_ENV === 'production' 
    ? RATE_LIMIT.MAX_REQUESTS.PRODUCTION 
    : RATE_LIMIT.MAX_REQUESTS.DEVELOPMENT,
  message: 'Too many password reset attempts. Please try again in 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development'
});

const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: process.env.NODE_ENV === 'production' 
    ? RATE_LIMIT.MAX_REQUESTS.PRODUCTION 
    : RATE_LIMIT.MAX_REQUESTS.DEVELOPMENT,
  message: 'Too many requests, please try again later.'
});

const loginLimiter = rateLimit({
  windowMs: RATE_LIMIT.LOGIN.WINDOW_MS,
  max: process.env.NODE_ENV === 'production' 
    ? RATE_LIMIT.LOGIN.MAX_ATTEMPTS.PRODUCTION 
    : RATE_LIMIT.LOGIN.MAX_ATTEMPTS.DEVELOPMENT,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

module.exports = {
  resetPasswordLimiter,
  generalLimiter,
  loginLimiter
};