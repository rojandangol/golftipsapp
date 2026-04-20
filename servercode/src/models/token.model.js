const db = require('../config/database');

class TokenModel {
  /**
   * Create a new token
   */
  static async create(userId, token, expiresAt, rememberMe = false) {
    const [result] = await db.query(
      `INSERT INTO user_tokens (user_id, token, expires_at, remember_me, last_activity) 
       VALUES (?, ?, ?, ?, NOW())`,
      [userId, token, expiresAt, rememberMe]
    );
    return result.insertId;
  }

  /**
   * Find token with user info
   */
  static async findWithUser(token) {
    const [results] = await db.query(
      `SELECT ut.user_id, ut.expires_at, ut.remember_me, u.username 
       FROM user_tokens ut
       JOIN Users u ON ut.user_id = u.user_id
       WHERE ut.token = ? AND ut.expires_at > NOW()`,
      [token]
    );
    return results[0];
  }

  /**
   * Update token expiry
   */
  static async updateExpiry(token, newExpiry) {
    const [result] = await db.query(
      `UPDATE user_tokens SET expires_at = ?, last_activity = NOW() WHERE token = ?`,
      [newExpiry, token]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete specific token (logout)
   */
  static async delete(token) {
    const [result] = await db.query(
      'DELETE FROM user_tokens WHERE token = ?',
      [token]
    );
    return result.affectedRows;
  }

  /**
   * Delete all expired tokens
   */
  static async deleteExpired() {
    const [result] = await db.query(
      'DELETE FROM user_tokens WHERE expires_at < NOW()'
    );
    return result.affectedRows;
  }
}

module.exports = TokenModel;