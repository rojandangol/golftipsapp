const express = require('express');
const PasswordController = require('../controllers/password.controller');
const { resetPasswordLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Initiate password reset (send OTP)
router.post('/forgot-password', resetPasswordLimiter, PasswordController.forgotPassword);

// Verify reset code
router.post('/verify-reset-code', resetPasswordLimiter, PasswordController.verifyResetCode);

// Reset password
router.post('/reset-password', resetPasswordLimiter, PasswordController.resetPassword);

module.exports = router;