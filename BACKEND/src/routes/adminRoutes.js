const express = require('express');
const {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics,
  getAdminUsers
} = require('../controllers/adminController');

const router = express.Router();

router.get('/overview', getAdminDashboardOverview);
router.get('/stats', getAdminDashboardStats);
router.get('/reports', getAdminReports);
router.get('/dashboard-analytics', getAdminDashboardAnalytics);
router.get('/users', getAdminUsers);

module.exports = router;