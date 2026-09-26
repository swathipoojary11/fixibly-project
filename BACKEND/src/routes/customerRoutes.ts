const express = require("express");
const router = express.Router();

// Middleware Imports
const { authenticateUser } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Controller Imports
const {
  getCustomerDashboard,
  getProfile,
  getServiceCategories,
  getServiceProblems,
  getBookingInitData,
  getBookingSummary,
  createBooking,
  getBookingById,
  getBookingTracking,
  cancelBooking,
  completeBooking,
  submitFeedback,
  submitPlatformFeedback,
  getCustomerHistory,
  getNotifications,
  markNotificationRead
} = require("../controllers/customerController");

// 1. Dashboard
router.get(
  "/dashboard",
  authenticateUser,
  authorizeRoles("Customer"),
  getCustomerDashboard
);

// 2. Profile
router.get(
  "/profile",
  authenticateUser,
  authorizeRoles("Customer"),
  getProfile
);

// 3. Service Catalog
router.get("/services", getServiceCategories);

router.get(
  "/services/:categoryId/problems",
  getServiceProblems
);

// 4. Booking Init Data
router.get(
  "/booking-init/:categoryId",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingInitData
);

// 5. Booking Pricing & Summary
router.post(
  "/bookings/summary",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingSummary
);

// 6. Confirm & Place Booking
router.post(
  "/bookings",
  authenticateUser,
  authorizeRoles("Customer"),
  createBooking
);

// 7. Booking History
router.get(
  "/bookings/history",
  authenticateUser,
  authorizeRoles("Customer"),
  getCustomerHistory
);

// 8. Single Booking Details
router.get(
  "/bookings/:bookingId",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingById
);

// 9. Live Tracking
router.get(
  "/bookings/:bookingId/tracking",
  authenticateUser,
  authorizeRoles("Customer"),
  getBookingTracking
);

// 10. Cancel Booking
router.patch(
  "/bookings/:bookingId/cancel",
  authenticateUser,
  authorizeRoles("Customer"),
  cancelBooking
);

// 11. Complete Booking (Handshake)
router.patch(
  "/bookings/:bookingId/complete",
  authenticateUser,
  authorizeRoles("Customer"),
  completeBooking
);

// 12. Technician Feedback
router.post(
  "/bookings/:bookingId/feedback",
  authenticateUser,
  authorizeRoles("Customer"),
  submitFeedback
);

// 13. Platform Feedback
router.post(
  "/platform-feedback",
  authenticateUser,
  authorizeRoles("Customer"),
  submitPlatformFeedback
);

// 14. Notifications
router.get(
  "/notifications",
  authenticateUser,
  authorizeRoles("Customer"),
  getNotifications
);

router.patch(
  "/notifications/:notificationId/read",
  authenticateUser,
  authorizeRoles("Customer"),
  markNotificationRead
);

module.exports = router;