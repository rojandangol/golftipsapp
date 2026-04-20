module.exports = {
  // Security
  SALT_ROUNDS: 10,
  
  // Token expiry (in milliseconds)
  TOKEN_EXPIRY: {
    REGULAR: 7 * 24 * 60 * 60 * 1000,      // 7 days
    REMEMBER_ME: 30 * 24 * 60 * 60 * 1000  // 30 days
  },
  
  // OTP expiry (in seconds for Redis)
  OTP_EXPIRY: 600, // 10 minutes
  RESET_TOKEN_EXPIRY: 900, // 15 minutes
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: {
      PRODUCTION: 3,
      DEVELOPMENT: 100
    },
    LOGIN: {
      WINDOW_MS: 1 * 60 * 1000, // 1 minute
      MAX_ATTEMPTS: {
        PRODUCTION: 5,
        DEVELOPMENT: 50
      }
    }
  },
  
  // OTP attempts
  MAX_OTP_ATTEMPTS: 5,
  
  // Token cleanup interval
  TOKEN_CLEANUP_INTERVAL: 86400000 // 24 hours
};