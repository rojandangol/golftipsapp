const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/user.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateInput } = require('../middleware/validation');

const router = express.Router();

// Get user by ID
router.get('/users/:id', authenticateToken, UserController.getUserById);

// Update user info
router.post('/putuserinfo', [
  body('username').isLength({ min: 3, max: 20 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('phone_number').isMobilePhone(),
  body('password').optional().isLength({ min: 8 }),
  validateInput,
  authenticateToken
], UserController.updateUser);

// Verify password
router.post('/verifyPassword', authenticateToken, UserController.verifyPassword);

// Check if email is admin
router.post('/check-admin-email', [
  body('email').isEmail().normalizeEmail(),
  validateInput
], UserController.checkAdminEmail);


// Delete user account
router.delete('/deleteAccount', [
  body('user_id').isInt(),
  validateInput,
  authenticateToken
], UserController.deleteAccount);

module.exports = router;