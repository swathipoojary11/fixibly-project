// backend/src/services/bookingService.js
// Business logic wrapper for booking calculations, cancellations, completions, and feedback          .

const bookingRepository = require('../repositories/bookingRepository');
const serviceRepository = require('../repositories/serviceRepository');

class BookingService {
  // Calculate price summary (Base Price, Emergency Charge, Advance Amount, Grand Total)
  async calculateBookingSummary(params) {
    const { problemId, isCustomProblem, emergencyFlag } = params;

    let basePrice = null;

    // 1. Fetching fixed price if predefined problem is selected
    if (problemId && !isCustomProblem) {
      const problem = await bookingRepository.getProblemById(problemId);
      if (problem && problem.fixed_price !== null) {
        basePrice = Number(problem.fixed_price);
      }
    }

    // 2. Calculating Emergency Charge (₹300) and Advance Amount (₹200)
    const emergencyCharge = emergencyFlag ? 300 : 0;
    const advanceAmount = emergencyFlag ? 200 : 0;

    let grandTotal = null;
    let priceMessage = 'Final price will be provided after on-site technician inspection.';

    if (basePrice !== null) {
      grandTotal = basePrice + emergencyCharge;
      priceMessage = `Estimated Total: ₹${grandTotal} (Base ₹${basePrice} + Emergency ₹${emergencyCharge})`;
    } else if (emergencyFlag) {
      priceMessage = 'Advance Payment ₹200 required for emergency dispatch. Remaining balance decided after inspection.';
    }

    return {
      basePrice,
      emergencyCharge,
      advanceAmount,
      grandTotal,
      priceMessage
    };
  }

  // Create customer booking payload and save into Supabase
  async createCustomerBooking(customerId, payload) {
    // 1. Calculating pricing summary
    const summary = await this.calculateBookingSummary({
      problemId: payload.problemId,
      isCustomProblem: !payload.problemId || payload.isCustomProblem,
      emergencyFlag: payload.emergencyFlag
    });

    // 2. Formatting complete booking object for repository insertion
    const bookingPayload = {
      ...payload,
      customerId,
      estimatedAmount: summary.grandTotal,
      advanceAmount: summary.advanceAmount
    };

    return await bookingRepository.createBookingTransaction(bookingPayload);
  }

  // Fetch full details of a specific booking
  async getBookingDetails(bookingId) {
    return await bookingRepository.getBookingDetailsById(bookingId);
  }

  // Fetch live tracking details and technician location
  async getTrackingDetails(bookingId) {
    return await bookingRepository.getBookingTrackingDetails(bookingId);
  }

  // Cancel booking with 40-minute ETA rule check
  async cancelCustomerBooking(bookingId, userId, reason) {
    return await bookingRepository.cancelBookingById(bookingId, userId, reason);
  }

  // Complete customer booking handshake
  async completeCustomerBooking(bookingId, userId) {
    return await bookingRepository.completeBookingById(bookingId, userId);
  }

  // Submit technician rating and comments
  async submitTechnicianFeedback(bookingId, customerId, feedbackData) {
    return await bookingRepository.submitFeedback(bookingId, customerId, feedbackData);
  }

  // Submit platform experience feedback
  async submitPlatformFeedback(customerId, rating, comments) {
    return await bookingRepository.submitAppFeedback(customerId, rating, comments);
  }

  // Fetch complete booking history for customer
  async getCustomerBookingHistory(userId) {
    return await bookingRepository.getCustomerHistory(userId);
  }

  // Fetch customer notifications list
  async getNotifications(userId) {
    return await bookingRepository.getCustomerNotifications(userId);
  }

  // Mark notification read status
  async markNotificationRead(notificationId, userId) {
    return await bookingRepository.markNotificationAsRead(notificationId, userId);
  }
}

module.exports = new BookingService();