const Notification = require('../model/notification');

/**
 * Send a notification to a user (called internally, not via HTTP).
 */
const notify = async (userId, { title, message, type = 'general', relatedId = null, actionUrl = null, priority = 'medium' }) => {
  try {
    await Notification.create({ userId, title, message, type, relatedId, actionUrl, priority });
  } catch (err) {
    console.error('[notify] failed:', err.message);
  }
};

module.exports = notify;
