const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Signup
// router.post('/signup', [
//   body('email').isEmail().normalizeEmail(),
//   body('username').isLength({ min: 3, max: 20 }).trim(),
//   body('password').isLength({ min: 8 }),
//   body('phone_number').matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits'),
//   validateInput
// ], AuthController.signup);

router.post('/signup', [
  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail()
    .customSanitizer(value => value.toLowerCase()),
  body('username')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be 3-20 characters')
    .trim()
    .customSanitizer(value => value.toLowerCase())
    .matches(/^[a-z0-9_]+$/).withMessage('Username can only contain lowercase letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone_number')
    .optional({ nullable: true, checkFalsy: true })  // Make optional
    .matches(/^\d{10,15}$/).withMessage('Phone number must be 10-15 digits'),
  body('firstname').trim().notEmpty(),
  body('lastname').trim().notEmpty(),
  validateInput
], AuthController.signup);

// Login
router.post('/checkuserlogin', [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  validateInput,
  loginLimiter
], AuthController.login);

// Logout
router.post('/logout', authenticateToken, AuthController.logout);

// Extend token
router.post('/extendToken', authenticateToken, AuthController.extendToken);

// Check username availability
router.post('/check-username', [
  body('username').notEmpty().withMessage('Username is required'),
  validateInput
], AuthController.checkUsername);

// Check email availability
router.post('/check-email', [
  body('email').isEmail().withMessage('Valid email is required'),
  validateInput
], AuthController.checkEmail);


module.exports = router;