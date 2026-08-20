const express = require('express');
const {
  assignTechnician,
  reassignTechnician,
  updateBookingStatus,
  triggerEmergencyBroadcast,
  downgradeEmergency,
  getTechnicianSummaryStats,
  getDispatcherDashboardStats,
  searchCustomers,
  searchCustomerByPhone,
  createManualBooking,
  getDispatcherProfile,
  getActiveBookingsWithLocation,
  acceptEmergencyBroadcast
} = require('../controllers/dispatcherController');
const { authenticateUser } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

// Assign, Reassign & Lifecycle Routes
router.patch('/assign', assignTechnician);
router.patch('/reassign', reassignTechnician);
router.patch('/status', updateBookingStatus);
router.get("/profile", getDispatcherProfile);
// Emergency Routes
router.post('/emergency/broadcast', triggerEmergencyBroadcast);
router.post('/emergency/accept', acceptEmergencyBroadcast);
router.patch('/emergency/downgrade', downgradeEmergency);

// Customer Search Routes
router.get('/customer', searchCustomerByPhone);
router.get('/customers/search', searchCustomers);

// Stats & Overview Routes for Dispatcher UI
router.get('/technicians/summary', getTechnicianSummaryStats);
router.get('/dashboard-stats', getDispatcherDashboardStats);
router.get('/active-with-location', getActiveBookingsWithLocation);

// Manual Actions
router.post('/manual-booking', createManualBooking);

module.exports = router;