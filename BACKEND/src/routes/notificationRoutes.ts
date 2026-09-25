const express = require('express');
const { getNotifications, getUnreadBadgeCount, markAllNotificationsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', getNotifications);
router.get('/unread-count', getUnreadBadgeCount);
router.patch('/mark-read', markAllNotificationsRead);

module.exports = router;