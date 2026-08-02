// const createBookingService = (bookingData) => {

//     // For now, we are only preparing the booking data.
//     // Supabase will be connected here later.

//  const booking = {
//         bookingId: "BK-" + Date.now(),
//         ...bookingData,
//         status: "Pending",
//         paymentStatus: "Pending"
//     };

//     return booking;
// };

// module.exports = {
//     createBookingService
// };

// backend/src/services/bookingService.js
// const bookingRepository = require('../repositories/bookingRepository');
// const supabase = require('../config/supabase');

// const createCustomerBooking = async (customerId, payload) => {
//   const {
//     category_id,
//     problem_id,
//     issue_description,
//     emergency_flag,
//     emergency_reason,
//     preferred_date,
//     preferred_time,
//     anytime_service,
//     house_number,
//     apartment_name,
//     street,
//     area,
//     city,
//     state,
//     pincode
//   } = payload;

//   // Business Rule: Check if problem has a fixed price
//   let estimated_amount = null;
//   if (problem_id) {
//     const { data: problem } = await supabase
//       .from('service_problems')
//       .select('fixed_price')
//       .eq('problem_id', problem_id)
//       .single();

//     if (problem && problem.fixed_price) {
//       estimated_amount = problem.fixed_price;
//     }
//   }

//   const priority = emergency_flag ? 'Emergency' : 'Normal';
//   const advance_amount = emergency_flag ? 300.00 : 0.00; // Fixed advance fee for emergencies

//   const bookingData = {
//     customer_id: customerId,
//     category_id,
//     problem_id: problem_id || null,
//     issue_description: issue_description || null,
//     emergency_flag: Boolean(emergency_flag),
//     emergency_reason: emergency_flag ? emergency_reason : null,
//     priority,
//     preferred_date: anytime_service ? null : preferred_date,
//     preferred_time: anytime_service ? null : preferred_time,
//     anytime_service: Boolean(anytime_service),
//     house_number,
//     apartment_name,
//     street,
//     area,
//     city,
//     state,
//     pincode,
//     estimated_amount,
//     advance_amount
//   };

//   return await bookingRepository.createBookingTransaction(bookingData);
// };

// module.exports = {
//   createCustomerBooking
// };

// src/repositories/bookingRepository.js
// src/services/bookingService.js
// src/services/bookingService.js
const bookingRepository = require('../repositories/bookingRepository');
const { supabase } = require('../config/supabase');

class BookingService {
  async getBookingFormInitData(userId, categoryId) {
    const [customer, category, problems] = await Promise.all([
      bookingRepository.getUserProfile(userId),
      bookingRepository.getCategoryById(categoryId),
      bookingRepository.getCategoryProblems(categoryId)
    ]);

    return {
      customer,
      category,
      problems
    };
  }

  // STEP 2: Calculate Pricing & Summary
  async calculateBookingSummary(payload) {
    const { problemId, isCustomProblem, emergencyFlag } = payload;

    let basePrice = null;
    let isInspectionRequired = false;

    // 1. Determine Base Price
    if (isCustomProblem || !problemId) {
      isInspectionRequired = true;
      basePrice = null;
    } else {
      // Lookup fixed price for the chosen problem
      const { data: problem, error } = await supabase
        .from('service_problems')
        .select('fixed_price')
        .eq('problem_id', problemId)
        .single();

      if (error || !problem || problem.fixed_price === null) {
        isInspectionRequired = true;
        basePrice = null;
      } else {
        basePrice = parseFloat(problem.fixed_price);
      }
    }

    // 2. Dynamic Emergency Surcharge
    const emergencyCharge = emergencyFlag ? 300.00 : 0.00;

    // 3. Grand Total Calculation
    const grandTotal = (basePrice !== null) ? (basePrice + emergencyCharge) : null;

    return {
      basePrice,
      emergencyCharge,
      grandTotal,
      isInspectionRequired,
      advancePaymentRequired: emergencyFlag ? emergencyCharge : 0.00,
      priceMessage: isInspectionRequired
        ? "Final price will be decided after technician inspection."
        : "Fixed price calculated based on selected service."
    };
  }
}

module.exports = new BookingService();