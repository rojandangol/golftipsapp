const express = require('express');
const TipController = require('../controllers/tip.controller');
const { authenticateToken, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all tips
router.get('/allTips', authenticateToken, TipController.getAllTips);

// Get tips by category (GET with param)
router.get('/tipsType/:category', authenticateToken, TipController.getTipsByCategory);

// Get tips by type (GET with param - different endpoint)
router.get('/gettipsonclick/:type', authenticateToken, TipController.getTipsByCategory);

// Get tips by category (POST with body)
router.post('/get-tips-by-category', authenticateToken, TipController.getTipsByCategory);

// Get YouTube link by tip ID
router.get('/ytLink/:tip_id', authenticateToken, TipController.getYouTubeLink);

// Add tip (admin only)
router.post('/addTip', adminAuth, TipController.addTip);

// Delete tip by ID (admin only) - DELETE method
router.delete('/deleteTip/:tip_id', adminAuth, TipController.deleteTip);

// Delete tip by ID (admin only) - POST method (for compatibility)
router.post('/delete-tips', adminAuth, TipController.deleteTip);

// Delete tip by title (admin only)
router.delete('/deleteTipTitle/:title', adminAuth, TipController.deleteTipByTitle);

// Update tip by ID (admin only)
router.put('/updateTip/:tip_id', adminAuth, TipController.updateTip);

module.exports = router;