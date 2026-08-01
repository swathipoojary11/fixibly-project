import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { getNotifications, getUnreadBadgeCount, markAllNotificationsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authenticateUser, getNotifications);
router.get('/unread-count', authenticateUser, getUnreadBadgeCount);
router.patch('/mark-read', authenticateUser, markAllNotificationsRead);

export default router;