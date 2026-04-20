const db = require('../config/database');

class UserModel {
  /**
   * Find user by username
   */
  static async findByUsername(username) {
    const [results] = await db.query(
      'SELECT user_id, username, password FROM Users WHERE username = ?',
      [username]
    );
    return results[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const [results] = await db.query(
      'SELECT user_id, username, email FROM Users WHERE email = ?',
      [email]
    );
    return results[0];
  }

    /**
   * Check if email exists
   */
  static async emailExists(email) {
    const [results] = await db.query(
      'SELECT email FROM Users WHERE email = ?',
      [email.toLowerCase()]
    );
    return results.length > 0;
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    const [results] = await db.query(
      'SELECT user_id, username, email, phone_number FROM Users WHERE user_id = ?',
      [userId]
    );
    return results[0];
  }

  /**
   * Check if username exists
   */
  static async usernameExists(username) {
    const [results] = await db.query(
      'SELECT username FROM Users WHERE username = ?',
      [username]
    );
    return results.length > 0;
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const { firstname, lastname, email, phone_number, username, password } = userData;
    const [result] = await db.query(
      `INSERT INTO Users (firstname, lastname, email, phone_number, username, password) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, phone_number, username, password]
    );
    return result.insertId;
  }

  /**
   * Update user info
   */
  static async update(userId, updates) {
    const { username, email, phone_number, password } = updates;
    
    let query, params;
    
    if (password) {
      query = `UPDATE Users SET username = ?, password = ?, email = ?, phone_number = ? WHERE user_id = ?`;
      params = [username, password, email, phone_number, userId];
    } else {
      query = `UPDATE Users SET username = ?, email = ?, phone_number = ? WHERE user_id = ?`;
      params = [username, email, phone_number, userId];
    }
    
    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }

  /**
   * Get user password hash
   */
  static async getPasswordHash(userId) {
    const [results] = await db.query(
      'SELECT password FROM Users WHERE user_id = ?',
      [userId]
    );
    return results[0]?.password;
  }

  /**
   * Update password by email
   */
  static async updatePasswordByEmail(email, hashedPassword) {
    const [result] = await db.query(
      'UPDATE Users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );
    return result.affectedRows > 0;
  }

  /**
   * Find admin by email
   */
  static async findAdminByEmail(email) {
    const [results] = await db.query(
      'SELECT user_id, username, email, admin FROM Users WHERE email = ? AND admin = 1',
      [email]
    );
    return results[0];
  }


    /**
   * Delete user account
   */
  static async deleteAccount(userId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Delete saved tips first (foreign key constraint)
      await connection.query('DELETE FROM Savedtips WHERE user_id = ?', [userId]);
      
      // Delete any user tokens
      await connection.query('DELETE FROM user_tokens WHERE user_id = ?', [userId]);
      
      // Delete the user account
      const [result] = await connection.query('DELETE FROM Users WHERE user_id = ?', [userId]);
      
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}


module.exports = UserModel;