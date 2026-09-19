// backend/src/routes/adminRoutes.ts
import express, { Router } from 'express';

import {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics,
  getAdminUsers
} from '../controllers/adminController';

const router: Router = express.Router();

router.get('/overview', getAdminDashboardOverview);
router.get('/stats', getAdminDashboardStats);
router.get('/reports', getAdminReports);
router.get('/dashboard-analytics', getAdminDashboardAnalytics);
router.get('/users', getAdminUsers);

export default router;