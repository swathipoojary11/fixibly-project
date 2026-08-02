// // backend/src/repositories/bookingRepository.js
// const supabase = require('../config/supabase');

// const createBookingTransaction = async (bookingData) => {
//   // 1. Insert into bookings table
//   const { data: booking, error: bookingError } = await supabase
//     .from('bookings')
//     .insert([
//       {
//         customer_id: bookingData.customer_id,
//         category_id: bookingData.category_id,
//         problem_id: bookingData.problem_id || null,
//         issue_description: bookingData.issue_description || null,
//         emergency_flag: bookingData.emergency_flag,
//         emergency_reason: bookingData.emergency_reason || null,
//         priority: bookingData.priority, // 'Normal' or 'Emergency'
//         preferred_date: bookingData.preferred_date || null,
//         preferred_time: bookingData.preferred_time || null,
//         anytime_service: bookingData.anytime_service,
//         house_number: bookingData.house_number || null,
//         apartment_name: bookingData.apartment_name || null,
//         street: bookingData.street,
//         area: bookingData.area,
//         city: bookingData.city,
//         state: bookingData.state,
//         pincode: bookingData.pincode,
//         estimated_amount: bookingData.estimated_amount || null,
//         booking_status: 'Pending'
//       }
//     ])
//     .select()
//     .single();

//   if (bookingError) {
//     console.error('Error creating booking:', bookingError);
//     throw new Error(bookingError.message);
//   }

//   // 2. Add initial status history record
//   const { error: historyError } = await supabase
//     .from('booking_status_history')
//     .insert([
//       {
//         booking_id: booking.booking_id,
//         status: 'Pending'
//       }
//     ]);

//   if (historyError) {
//     console.error('Error adding status history:', historyError);
//   }

//   // 3. Handle Advance Payment if Emergency
//   if (bookingData.emergency_flag && bookingData.advance_amount > 0) {
//     const { error: paymentError } = await supabase
//       .from('payments')
//       .insert([
//         {
//           booking_id: booking.booking_id,
//           amount: bookingData.advance_amount,
//           payment_status: 'Successful', // Or 'Pending' depending on gateway integration
//           payment_type: 'Advance'
//         }
//       ]);

//     if (paymentError) {
//       console.error('Error recording advance payment:', paymentError);
//     }
//   }

//   // 4. Notify Dispatchers
//   // Query all users with role Dispatcher (assuming role_id = 3 or fetched dynamically)
//   const { data: dispatchers } = await supabase
//     .from('users')
//     .select('user_id')
//     .eq('role_id', 3); // Role ID for Dispatcher

//   if (dispatchers && dispatchers.length > 0) {
//     const notifications = dispatchers.map((disp) => ({
//       user_id: disp.user_id,
//       booking_id: booking.booking_id,
//       title: bookingData.emergency_flag ? '🚨 EMERGENCY BOOKING' : 'New Booking Received',
//       description: `New ${bookingData.priority.toLowerCase()} booking #${booking.booking_id} created for category ID ${bookingData.category_id}.`,
//       notification_type: bookingData.emergency_flag ? 'Emergency' : 'Booking',
//       priority: bookingData.emergency_flag ? 'High' : 'Medium'
//     }));

//     await supabase.from('notifications').insert(notifications);
//   }

//   return booking;
// };

// module.exports = {
//   createBookingTransaction
// };

// src/repositories/bookingRepository.js
// src/repositories/bookingRepository.js
const { supabase } = require('../config/supabase'); // Adjust path to your Supabase client

class BookingRepository {
  // Fetch logged-in user details
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('full_name, email, phone')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Fetch Category details
  async getCategoryById(categoryId) {
    const { data, error } = await supabase
      .from('service_categories')
      .select('category_id, category_name, category_image_url')
      .eq('category_id', categoryId)
      .single();

    if (error) throw error;
    return data;
  }

  // Fetch active problems for category
  async getCategoryProblems(categoryId) {
    const { data, error } = await supabase
      .from('service_problems')
      .select('problem_id, problem_name, fixed_price')
      .eq('category_id', categoryId)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  }
}

module.exports = new BookingRepository();