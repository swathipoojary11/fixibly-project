import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
  assignTechnician,
  reassignTechnician,
  updateBookingStatus,
  triggerEmergencyBroadcast,
  downgradeEmergency,
  getTechnicianSummaryStats,
  getDispatcherDashboardStats,
  createManualBooking,
  getIntakeBookings
} from '../controllers/dispatcherController.js';

const router = express.Router();

// Intake stream & stats
router.get('/bookings', authenticateUser, getIntakeBookings);
router.get('/dashboard-stats', authenticateUser, getDispatcherDashboardStats);
router.get('/technicians/summary', authenticateUser, getTechnicianSummaryStats);

// Assignment & Lifecycle
router.patch('/assign', authenticateUser, assignTechnician);
router.patch('/reassign', authenticateUser, reassignTechnician);
router.patch('/status', authenticateUser, updateBookingStatus);

// Emergency Actions
router.post('/emergency/broadcast', authenticateUser, triggerEmergencyBroadcast);
router.patch('/emergency/downgrade', authenticateUser, downgradeEmergency);

// Manual Bookings
router.post('/manual-booking', authenticateUser, createManualBooking);

export default router;