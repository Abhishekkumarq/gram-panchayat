const Notification = require('../model/notification');

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, actionUrl, priority } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ 
        error: 'userId, title, and message are required' 
      });
    }

    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'general',
      relatedId: relatedId || null,
      actionUrl: actionUrl || null,
      priority: priority || 'medium'
    });

    await notification.save();
    res.status(201).json({ 
      success: true, 
      message: 'Notification created', 
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all notifications for a user
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const skip = (page - 1) * limit;
    const query = { userId };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      userId, 
      isRead: false 
    });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    res.json({ unreadCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ 
      success: true, 
      message: 'Notification marked as read',
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.json({ 
      success: true, 
      message: 'All notifications marked as read',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({ 
      success: true, 
      message: 'Notification deleted' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.deleteMany({ userId });

    res.json({ 
      success: true, 
      message: 'All notifications deleted',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications by type
exports.getNotificationsByType = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, page = 1, limit = 20 } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Type parameter is required' });
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId, type })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments({ userId, type });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Create notification for user
exports.adminCreateNotification = async (req, res) => {
  try {
    const { userId, title, message, type, relatedId, actionUrl, priority } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ 
        error: 'userId, title, and message are required' 
      });
    }

    const notification = new Notification({
      userId,
      title,
      message,
      type: type || 'general',
      relatedId: relatedId || null,
      actionUrl: actionUrl || null,
      priority: priority || 'medium'
    });

    await notification.save();
    res.status(201).json({ 
      success: true, 
      message: 'Notification created', 
      notification 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Get all notifications (with filtering)
exports.adminGetAllNotifications = async (req, res) => {
  try {
    const { userId, type, isRead, page = 1, limit = 20 } = req.query;

    const query = {};
    
    if (userId) query.userId = userId;
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    const total = await Notification.countDocuments(query);

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Broadcast notification to all users
exports.adminBroadcastNotification = async (req, res) => {
  try {
    const { title, message, type, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ 
        error: 'title and message are required' 
      });
    }

    // Get all users
    const User = require('../model/user');
    const users = await User.find({}, '_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      title,
      message,
      type: type || 'general',
      priority: priority || 'medium'
    }));

    const result = await Notification.insertMany(notifications);

    res.status(201).json({ 
      success: true, 
      message: `Notification sent to ${result.length} users`,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
