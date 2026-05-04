const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate: authMiddleware } = require('../middleware/authMiddleware');

// User routes (require authentication)
router.get('/my', authMiddleware, notificationController.getMyNotifications);
router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);
router.get('/by-type', authMiddleware, notificationController.getNotificationsByType);
router.get('/:notificationId', authMiddleware, notificationController.getNotificationById);

router.put('/:notificationId/read', authMiddleware, notificationController.markAsRead);
router.put('/read-all', authMiddleware, notificationController.markAllAsRead);

router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);
router.delete('/', authMiddleware, notificationController.deleteAllNotifications);

// Admin routes (create notifications for users)
// Note: You can add admins-only middleware if needed
router.post('/', authMiddleware, notificationController.createNotification);
router.post('/admin/create', authMiddleware, notificationController.adminCreateNotification);
router.post('/admin/broadcast', authMiddleware, notificationController.adminBroadcastNotification);
router.get('/admin/all', authMiddleware, notificationController.adminGetAllNotifications);

module.exports = router;
