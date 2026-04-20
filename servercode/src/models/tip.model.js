const db = require('../config/database');

class TipModel {
  /**
   * Get all tips
   */
  static async findAll() {
    const [results] = await db.query('SELECT * FROM Tips');
    return results;
  }

  /**
   * Get tips by category/type
   */
  // static async findByCategory(category) {
  //   const [results] = await db.query(
  //     'SELECT * FROM Tips WHERE type = ? ORDER BY created_at DESC',
  //     [category]
  //   );
  //   return results;
  // }
  static async findByCategory(category, limit = 20, offset = 0) {
    const [results] = await db.query(
      'SELECT * FROM Tips WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [category, limit, offset]
    );
    return results;
  }

  static async countByCategory(category) {
    const [results] = await db.query(
      'SELECT COUNT(*) as total FROM Tips WHERE type = ?',
      [category]
    );
    return results[0].total;
  }

  /**
   * Get YouTube link by tip ID
   */
  static async getYouTubeLink(tipId) {
    const [results] = await db.query(
      'SELECT ytlink FROM Tips WHERE tips_id = ?',
      [tipId]
    );
    return results[0]?.ytlink;
  }

  /**
   * Create new tip
   */
  static async create(tipData) {
    const [result] = await db.query('INSERT INTO Tips SET ?', tipData);
    return result.insertId;
  }

  /**
   * Delete tip by ID
   */
  static async deleteById(tipId) {
    const [result] = await db.query(
      'DELETE FROM Tips WHERE tips_id = ?',
      [tipId]
    );
    return result.affectedRows > 0;
  }

  /**
   * Delete tip by title
   */
  static async deleteByTitle(title) {
    const [result] = await db.query(
      'DELETE FROM Tips WHERE title = ?',
      [title]
    );
    return result.affectedRows > 0;
  }

  /**
   * Update tip by ID
   */
  static async updateById(tipId, tipData) {
    const { title, details, ytlink } = tipData;
    const [result] = await db.query(
      'UPDATE Tips SET title = ?, details = ?, ytlink = ? WHERE tips_id = ?',
      [title, details, ytlink || null, tipId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = TipModel;