const express = require('express');
const {
  assignTechnician,
  reassignTechnician,
  updateBookingStatus,
  triggerEmergencyBroadcast,
  downgradeEmergency,
  getTechnicianSummaryStats,
  getDispatcherDashboardStats,
  createManualBooking
} = require('../controllers/dispatcherController');

const router = express.Router();

// Assign, Reassign & Lifecycle Routes
router.patch('/assign', assignTechnician);
router.patch('/reassign', reassignTechnician);
router.patch('/status', updateBookingStatus);

// Emergency Routes
router.post('/emergency/broadcast', triggerEmergencyBroadcast);
router.patch('/emergency/downgrade', downgradeEmergency);

// Stats & Overview Routes for Dispatcher UI
router.get('/technicians/summary', getTechnicianSummaryStats);
router.get('/dashboard-stats', getDispatcherDashboardStats);

// Manual Actions
router.post('/manual-booking', createManualBooking);

module.exports = router;