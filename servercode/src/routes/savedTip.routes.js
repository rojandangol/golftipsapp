const express = require('express');
const SavedTipController = require('../controllers/savedTip.controller');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Save a tip
router.post('/saveTips', authenticateToken, SavedTipController.saveTip);

// Add saved tip (alternative endpoint)
router.post('/addSavedTip', authenticateToken, SavedTipController.saveTip);

// Get saved tips for user
router.get('/retrieveSavedTips/:user_id', authenticateToken, SavedTipController.getSavedTips);

// Remove saved tip
router.delete('/removeSavedTips/:save_id', authenticateToken, SavedTipController.removeSavedTip);

module.exports = router;