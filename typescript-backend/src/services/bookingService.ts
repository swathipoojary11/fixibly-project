// backend/src/services/bookingService.js
// Business logic wrapper for booking calculations, cancellations, completions, and feedback          .
const bookingRepository = require('../repositories/bookingRepository');
const serviceRepository = require('../repositories/serviceRepository');

type IdType = string | number;

// Parameters needed to calculate pricing summary
type BookingSummaryParams = {
  problemId?: IdType | null;
  isCustomProblem?: boolean;
  emergencyFlag?: boolean;
};

// Result returned by calculateBookingSummary
type BookingSummaryResult = {
  basePrice: number | null;
  emergencyCharge: number;
  advanceAmount: number;
  grandTotal: number | null;
  priceMessage: string;
};

// Frontend request body passed into createCustomerBooking
type BookingPayload = {
  categoryId: IdType;
  problemId?: IdType | null;
  isCustomProblem?: boolean;
  emergencyFlag?: boolean;
  emergencyReason?: string | null;
  issueDescription?: string | null;
  customProblemDescription?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  anytimeService?: boolean;
  houseNumber?: string | null;
  apartmentName?: string | null;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  [key: string]: any; // Allows additional optional fields safely
};
class BookingService {
  // Calculate price summary (Base Price, Emergency Charge, Advance Amount, Grand Total)
async calculateBookingSummary(params: BookingSummaryParams): Promise<BookingSummaryResult> {
    const { problemId, isCustomProblem, emergencyFlag } = params;

    let basePrice: number | null = null;

    // 1. Fetching fixed price if predefined problem is selected
 if (problemId && !isCustomProblem) {
      const problem = await bookingRepository.getProblemById(problemId);
      if (problem && problem.fixed_price !== null && problem.fixed_price !== undefined) {
        basePrice = Number(problem.fixed_price);
      }
    }

    // 2. Calculating Emergency Charge (₹300) and Advance Amount (₹200)
const emergencyCharge: number = emergencyFlag ? 300 : 0;
    const advanceAmount: number = emergencyFlag ? 200 : 0;

let grandTotal: number | null = null;
    let priceMessage: string = 'Final price will be provided after on-site technician inspection.';

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
  async createCustomerBooking(customerId: IdType | undefined, payload: BookingPayload) {
    if (!customerId) {
      throw new Error('CUSTOMER_ID_REQUIRED');
    }

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
  async getBookingDetails(bookingId: IdType) {
    return await bookingRepository.getBookingDetailsById(bookingId);
  }

  // Fetch live tracking details and technician location
  async getTrackingDetails(bookingId: IdType) {
    return await bookingRepository.getBookingTrackingDetails(bookingId);
  }

  // Cancel booking with 40-minute ETA rule check
  async cancelCustomerBooking(bookingId: IdType, userId: IdType | undefined, reason?: string) {
    return await bookingRepository.cancelBookingById(bookingId, userId, reason);
  }

  // Complete customer booking handshake
  async completeCustomerBooking(bookingId: IdType, userId: IdType | undefined) {
    return await bookingRepository.completeBookingById(bookingId, userId);
  }

  // Submit technician rating and comments
  async submitTechnicianFeedback(bookingId: IdType, customerId: IdType | undefined, feedbackData: any) {
    return await bookingRepository.submitFeedback(bookingId, customerId, feedbackData);
  }

  // Submit platform experience feedback
  async submitPlatformFeedback(customerId: IdType | undefined, rating: number | string, comments?: string) {
    return await bookingRepository.submitAppFeedback(customerId, rating, comments);
  }

  // Fetch complete booking history for customer
  async getCustomerBookingHistory(userId: IdType | undefined) {
    return await bookingRepository.getCustomerHistory(userId);
  }

  // Fetch customer notifications list
  async getNotifications(userId: IdType | undefined) {
    return await bookingRepository.getCustomerNotifications(userId);
  }

  // Mark notification read status
  async markNotificationRead(notificationId: IdType, userId?: IdType) {
    return await bookingRepository.markNotificationAsRead(notificationId, userId);
  }
}
// module.exports = new BookingService();
const bookingService = new BookingService();
export default bookingService;