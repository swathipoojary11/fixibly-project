// backend/src/controllers/customerController.js
// Express HTTP controller handling customer REST API requests and responses.

const bookingService = require('../services/bookingService');
const serviceService = require('../services/serviceService');
const bookingRepository = require('../repositories/bookingRepository');

// 1. GET /api/customer/dashboard - Fetch customer dashboard stats & notifications count
const getCustomerDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    // Calling repository to get user profile, booking counts, and notifications
    const dashboardData = await bookingRepository.getCustomerDashboard(userId);

    return res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });
  } catch (error) {
    console.error('Error in getCustomerDashboard:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching dashboard'
    });
  }
};

// 2. GET /api/customer/profile - Fetch customer profile details
const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const profile = await bookingRepository.getUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile'
    });
  }
};

// 3. GET /api/customer/services - Fetch active service categories
const getServiceCategories = async (req, res) => {
  try {
    const categories = await serviceService.fetchServiceCategories();
    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
      data: categories
    });
  } catch (error) {
    console.error('Error in getServiceCategories:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service categories'
    });
  }
};

// 4. GET /api/customer/services/:categoryId/problems - Fetch problems by category
const getServiceProblems = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const problems = await serviceService.fetchProblemsByCategory(categoryId);

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems
    });
  } catch (error) {
    console.error('Error in getServiceProblems:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service problems'
    });
  }
};

// 5. GET /api/customer/booking-init/:categoryId - Fetch profile + category + problems on load
const getBookingInitData = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
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
    console.error('Error in getBookingInitData:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initialize booking data'
    });
  }
};

// 6. POST /api/customer/bookings/summary - Live pricing calculation preview
const getBookingSummary = async (req, res) => {
  try {
    const summary = await bookingService.calculateBookingSummary(req.body);
    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error in getBookingSummary:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate booking summary'
    });
  }
};

// 7. POST /api/customer/bookings - Create new customer booking
const createBooking = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const booking = await bookingService.createCustomerBooking(userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        bookingId: booking.booking_id,
        status: booking.booking_status,
        booking
      }
    });
  } catch (error) {
    console.error('Error in createBooking:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit booking'
    });
  }
};

// 8. GET /api/customer/bookings/:bookingId - Fetch single booking details with assigned technician
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingDetails(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error in getBookingById:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  }
};

// 9. GET /api/customer/bookings/:bookingId/tracking - Live tracking status history & technician location
const getBookingTracking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const trackingData = await bookingService.getTrackingDetails(bookingId);

    if (!trackingData) {
      return res.status(404).json({
        success: false,
        message: 'Tracking details not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Error in getBookingTracking:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tracking details'
    });
  }
};

// 10. PATCH /api/customer/bookings/:bookingId/cancel - Cancel booking with 40-min ETA check
const cancelBooking = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    const cancelledBooking = await bookingService.cancelCustomerBooking(bookingId, userId, cancellationReason);

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error.message);

    if (error.message === 'ETA_WITHIN_40_MINUTES') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking. Technician ETA is within 40 minutes.'
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel booking'
    });
  }
};

// 11. PATCH /api/customer/bookings/:bookingId/complete - Complete job handshake
const completeBooking = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const { bookingId } = req.params;

    const completedBooking = await bookingService.completeCustomerBooking(bookingId, userId);

    return res.status(200).json({
      success: true,
      message: 'Job completed successfully',
      data: completedBooking
    });
  } catch (error) {
    console.error('Error in completeBooking:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to complete job'
    });
  }
};

// 12. POST /api/customer/bookings/:bookingId/feedback - Submit technician rating & comments
const submitFeedback = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const { bookingId } = req.params;

    const feedback = await bookingService.submitTechnicianFeedback(bookingId, userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Technician feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in submitFeedback:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit feedback'
    });
  }
};

// 13. POST /api/customer/platform-feedback - Submit overall app experience feedback
const submitPlatformFeedback = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const { rating, comments } = req.body;

    const feedback = await bookingService.submitPlatformFeedback(userId, rating, comments);

    return res.status(201).json({
      success: true,
      message: 'Platform feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error in submitPlatformFeedback:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit platform feedback'
    });
  }
};

// 14. GET /api/customer/bookings/history - Fetch complete customer booking history
const getCustomerHistory = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const history = await bookingService.getCustomerBookingHistory(userId);

    return res.status(200).json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    console.error('Error in getCustomerHistory:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking history'
    });
  }
};

// 15. GET /api/customer/notifications - Fetch notifications list for customer
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const notifications = await bookingService.getNotifications(userId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error in getNotifications:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

// 16. PATCH /api/customer/notifications/:id/read - Mark notification read
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.user_id || req.user.id;
    const { id } = req.params;

    const notification = await bookingService.markNotificationRead(id, userId);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error in markNotificationRead:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
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