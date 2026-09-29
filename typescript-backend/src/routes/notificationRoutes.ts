import express, { Router } from 'express';

import {
  getNotifications,
  getUnreadBadgeCount,
  markAllNotificationsRead
} from '../controllers/notificationController';

const router: Router = express.Router();

router.get('/', getNotifications);
router.get('/unread-count', getUnreadBadgeCount);
router.patch('/mark-read', markAllNotificationsRead);

export default router;