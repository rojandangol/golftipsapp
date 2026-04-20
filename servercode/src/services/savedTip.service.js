const SavedTipModel = require('../models/savedTip.model');

class SavedTipService {
  /**
   * Save a tip for a user
   */
  static async saveTip(userId, tipId) {
    // Check if already saved
    const exists = await SavedTipModel.exists(userId, tipId);
    
    if (exists) {
      throw new Error('This tip is already saved');
    }

    const saveId = await SavedTipModel.create(userId, tipId);
    return saveId;
  }

  /**
   * Get all saved tips for a user
   */
  static async getSavedTips(userId) {
    return await SavedTipModel.findByUser(userId);
  }

  /**
   * Remove a saved tip
   */
  static async removeSavedTip(saveId, userId) {
    const success = await SavedTipModel.delete(saveId, userId);
    
    if (!success) {
      throw new Error('Saved tip not found or not authorized');
    }

    return true;
  }
}

module.exports = SavedTipService;