import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics,
  getUsers,
  toggleUserStatus,
  getActivityLogs
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/overview', authenticateUser, authorizeRoles('Admin'), getAdminDashboardOverview);
router.get('/stats', authenticateUser, authorizeRoles('Admin'), getAdminDashboardStats);
router.get('/reports', authenticateUser, authorizeRoles('Admin'), getAdminReports);
router.get('/dashboard-analytics', authenticateUser, authorizeRoles('Admin'), getAdminDashboardAnalytics);

// User Management
router.get('/users', authenticateUser, authorizeRoles('Admin'), getUsers);
router.patch('/users/:userId/toggle-status', authenticateUser, authorizeRoles('Admin'), toggleUserStatus);

// Activity Logs
router.get('/activity-logs', authenticateUser, authorizeRoles('Admin'), getActivityLogs);

export default router;
