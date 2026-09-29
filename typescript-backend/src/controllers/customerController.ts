// backend/src/controllers/customerController.js
// Express HTTP controller handling customer REST API requests and responses.
import { Request, Response } from 'express';
const bookingService = require("../services/bookingService");
const serviceService = require("../services/serviceService");
const bookingRepository = require("../repositories/bookingRepository");
type AuthenticatedUser = {
  user_id?: string | number;
  id?: string | number;
};
type AuthRequest = Request & {
  user?: AuthenticatedUser;
};

type CustomError = {
  message?: string;
};
// 1. GET /api/customer/dashboard - Fetch customer dashboard stats & notifications count
export const getCustomerDashboard = async (req:AuthRequest, res:Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;

    const dashboardData = await bookingRepository.getCustomerDashboard(userId);

    return res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });
  } catch (error) {
    const e= error as CustomError;
    console.error('Error in getCustomerDashboard:', e.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard'
    });
  }
};

// 2. GET /api/customer/profile - Fetch customer profile details
export const getProfile = async (req:AuthRequest, res:Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const profile = await bookingRepository.getUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    
    const e= error as CustomError;
    console.error('Error in getProfile:', e.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile'
    });
  }
};

// 3. GET /api/customer/services - Fetch active service categories
export const getServiceCategories = async (req: Request, res:Response) => {
  try {
    const categories = await serviceService.fetchServiceCategories();
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
      data: categories
    });
  } catch (error) {
     const e= error as CustomError;
    console.error('Error in getServiceCategories:', e.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories'
    });
  }
};

// 4. GET /api/customer/services/:categoryId/problems - Fetch problems by category
export const getServiceProblems = async (req: Request, res:Response) => {
  try {
    const { categoryId } = req.params;
    const problems = await serviceService.fetchProblemsByCategory(categoryId);

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    const e= error as CustomError;
    console.error('Error in getServiceProblems:', e.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service problems'
    });
  }
   
};

// 5. GET /api/customer/booking-init/:categoryId - Fetch profile + category + problems on load
export const getBookingInitData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { categoryId } = req.params;

    // Fetching user profile, category info, and problems in parallel
    const [customer, category, problems] = await Promise.all([
      bookingRepository.getUserProfile(userId),
      bookingRepository.getCategoryById(categoryId),
      bookingRepository.getCategoryProblems(categoryId)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        customer,
        category,
        problems
      }
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getBookingInitData:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to initialize booking data"
    });
  }
};

// 6. POST /api/customer/bookings/summary - Live pricing calculation preview
export const getBookingSummary = async (req: Request, res: Response) => {
  try {
    // req.body comes parsed by `express.json()`
    const summary = await bookingService.calculateBookingSummary(req.body);
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getBookingSummary:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate booking summary"
    });
  }
};
// 7. POST /api/customer/bookings - Create new customer booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const booking = await bookingService.createCustomerBooking(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        bookingId: booking.booking_id,
        status: booking.booking_status,
        booking
      }
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in createBooking:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to submit booking"
    });
  }
};

// 8. GET /api/customer/bookings/:bookingId - Fetch single booking details with assigned technician
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingDetails(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getBookingById:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking details"
    });
  }
};

// 9. GET /api/customer/bookings/:bookingId/tracking - Live tracking status history & technician location
export const getBookingTracking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const trackingData = await bookingService.getTrackingDetails(bookingId);

    if (!trackingData) {
      return res.status(404).json({
        success: false,
        message: "Tracking details not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getBookingTracking:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tracking details"
    });
  }
};

// 10. PATCH /api/customer/bookings/:bookingId/cancel - Cancel booking with 40-min ETA check
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    const cancelledBooking = await bookingService.cancelCustomerBooking(
      bookingId,
      userId,
      cancellationReason
    );

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in cancelBooking:", err.message);

    // Explicit check for known business logic errors
    if (err.message === "ETA_WITHIN_40_MINUTES") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking. Technician ETA is within 40 minutes."
      });
    }

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to cancel booking"
    });
  }
};  

// 11. PATCH /api/customer/bookings/:bookingId/complete - Complete job handshake
export const completeBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { bookingId } = req.params;

    const completedBooking = await bookingService.completeCustomerBooking(bookingId, userId);

    return res.status(200).json({
      success: true,
      message: "Job completed successfully",
      data: completedBooking
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in completeBooking:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to complete job"
    });
  }
};

// 12. POST /api/customer/bookings/:bookingId/feedback - Submit technician rating & comments
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { bookingId } = req.params;

    const feedback = await bookingService.submitTechnicianFeedback(bookingId, userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Technician feedback submitted successfully",
      data: feedback
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in submitFeedback:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to submit feedback"
    });
  }
};
// 13. POST /api/customer/platform-feedback - Submit overall app experience feedback
export const submitPlatformFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { rating, comments } = req.body;

    const feedback = await bookingService.submitPlatformFeedback(userId, rating, comments);

    return res.status(201).json({
      success: true,
      message: "Platform feedback submitted successfully",
      data: feedback
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in submitPlatformFeedback:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to submit platform feedback"
    });
  }
};

// 14. GET /api/customer/bookings/history - Fetch complete customer booking history
export const getCustomerHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const history = await bookingService.getCustomerBookingHistory(userId);

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getCustomerHistory:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch booking history"
    });
  }
};

// 15. GET /api/customer/notifications - Fetch notifications list for customer
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const notifications = await bookingService.getNotifications(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in getNotifications:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications"
    });
  }
};

// 16. PATCH /api/customer/notifications/:id/read - Mark notification read
export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;
    const { id } = req.params;

    const notification = await bookingService.markNotificationRead(id, userId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification
    });
  } catch (error) {
    const err = error as CustomError;
    console.error("Error in markNotificationRead:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read"
    });
  }
};

module.exports = {
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
};