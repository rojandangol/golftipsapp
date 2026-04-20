const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const tipRoutes = require('./tip.routes');
const savedTipRoutes = require('./savedTip.routes');
const passwordRoutes = require('./password.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

// Health check
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Mount route modules
router.use('/', authRoutes);
router.use('/', userRoutes);
router.use('/', tipRoutes);
router.use('/', savedTipRoutes);
router.use('/', passwordRoutes);
router.use('/', adminRoutes);

module.exports = router;