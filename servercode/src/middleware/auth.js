const db = require('../config/database');

/**
 * Middleware to authenticate regular users via Bearer token
 */
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const query = `
      SELECT ut.user_id, ut.expires_at, u.username 
      FROM user_tokens ut
      JOIN Users u ON ut.user_id = u.user_id
      WHERE ut.token = ? AND ut.expires_at > NOW()
    `;

    const [results] = await db.query(query, [token]);

    if (results.length === 0) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = {
      user_id: results[0].user_id,
      username: results[0].username
    };

    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Middleware to authenticate admin users via Bearer token
 */
async function adminAuth(req, res, next) {
  try {
    // Only check Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required' });
    }
    const token = authHeader.replace('Bearer ', '');

    const query = `
      SELECT ut.user_id, ut.expires_at, u.username, u.admin
      FROM user_tokens ut
      JOIN Users u ON ut.user_id = u.user_id
      WHERE ut.token = ? AND ut.expires_at > NOW() AND u.admin = 1
    `;

    const [results] = await db.query(query, [token]);

    if (results.length === 0) {
      return res.status(403).json({ message: 'Invalid token or admin access required' });
    }

    const userData = results[0];

    req.user = {
      user_id: userData.user_id,
      username: userData.username,
      isAdmin: true
    };

    next();
  } catch (err) {
    console.error('Database error during admin auth:', err);
    return res.status(500).json({ message: 'Database error' });
  }
}
module.exports = {
  authenticateToken,
  adminAuth
};