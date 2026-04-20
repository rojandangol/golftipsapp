const db = require('../config/database');

class SavedTipModel {
  /**
   * Check if tip is already saved by user
   */
  static async exists(userId, tipId) {
    const [results] = await db.query(
      'SELECT * FROM Savedtips WHERE user_id = ? AND tips_id = ?',
      [userId, tipId]
    );
    return results.length > 0;
  }

  /**
   * Save a tip
   */
  static async create(userId, tipId) {
    const [result] = await db.query(
      'INSERT INTO Savedtips (user_id, tips_id) VALUES (?, ?)',
      [userId, tipId]
    );
    return result.insertId;
  }

  /**
   * Get all saved tips for a user
   */
  static async findByUser(userId) {
    const [results] = await db.query(
      `SELECT * FROM Tips 
       JOIN Savedtips ON Tips.tips_id = Savedtips.tips_id 
       WHERE Savedtips.user_id = ?`,
      [userId]
    );
    return results;
  }

  /**
   * Delete saved tip
   */
  static async delete(saveId, userId) {
    const [result] = await db.query(
      'DELETE FROM Savedtips WHERE save_id = ? AND user_id = ?',
      [saveId, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = SavedTipModel;