const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/admin.controller');
const { adminAuth } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const { resetPasswordLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Send admin OTP
router.post('/send-admin-otp', [
  body('email').isEmail().normalizeEmail(),
  validateInput,
  resetPasswordLimiter
], AdminController.sendAdminOTP);

// Verify admin OTP
router.post('/verify-admin-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }),
  validateInput,
  resetPasswordLimiter
], AdminController.verifyAdminOTP);

// Verify admin token
router.post('/verify-token', adminAuth, AdminController.verifyToken);

// Admin logout
router.post('/admin-logout', adminAuth, AdminController.logout);

// Cleanup expired tokens
router.post('/admin-cleanup-tokens', adminAuth, AdminController.cleanupTokens);


// Verify admin session for nginx auth_request
router.get('/verify-admin-session', adminAuth, (req, res) => {
  res.status(200).send('OK');
});``

module.exports = router;