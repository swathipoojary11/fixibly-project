import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
    getServiceCategories,
    getServiceProblems,
    getCustomerDashboard,
    getBookingSummary,
    createBooking,
    getBookingById,
    getBookingTracking,
    confirmCompletion,
    getCustomerHistory,
    cancelBooking,
    submitFeedback,
    submitPlatformFeedback
} from "../controllers/customerController.js";

const router = express.Router();

// Public service info
router.get("/services", getServiceCategories);
router.get("/services/:categoryId/problems", getServiceProblems);

// Authenticated customer endpoints
router.get("/dashboard", authenticateUser, getCustomerDashboard);
router.post("/booking/summary", authenticateUser, getBookingSummary);
router.post("/bookings", authenticateUser, createBooking);
router.get("/bookings/history", authenticateUser, getCustomerHistory);
router.get("/bookings/:bookingId", authenticateUser, getBookingById);
router.get("/bookings/:bookingId/tracking", authenticateUser, getBookingTracking);
router.patch("/bookings/:bookingId/confirm-completion", authenticateUser, confirmCompletion);
router.patch("/bookings/:bookingId/cancel", authenticateUser, cancelBooking);
router.post("/feedback", authenticateUser, submitFeedback);
router.post("/platform-feedback", authenticateUser, submitPlatformFeedback);

export default router;
