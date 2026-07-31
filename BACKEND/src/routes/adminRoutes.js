const express = require('express');
const {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics
} = require('../controllers/adminController');

const router = express.Router();

router.get('/overview', getAdminDashboardOverview);
router.get('/stats', getAdminDashboardStats);
router.get('/reports', getAdminReports);

// NEW Route for Admin Analytics Charts
router.get('/dashboard-analytics', getAdminDashboardAnalytics);

module.exports = router;