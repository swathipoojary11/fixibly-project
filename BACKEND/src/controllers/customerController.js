// const {
//     createBookingService
// } = require("../services/bookingService");

// // GET Customer Profile

// const getCustomerProfile = (req, res) => {

//     const customer = {
//         id: 1,
//         name: "Swathi",
//         phone: "9876543210",
//         email: "swathi@gmail.com"
//     };

//     res.status(200).json(customer);
// };


// // POST Create Booking

// const createBooking = (req, res) => {

//     const bookingData = req.body;

//     console.log("Booking received:", bookingData);

//     const booking = createBookingService(bookingData);

//     res.status(201).json({
//         success: true,
//         message: "Booking created successfully",
//         booking: booking
//     });

// };


// module.exports = {
//     getCustomerProfile,
//     createBooking
// };

const supabase = require("../config/supabase");

// const getServiceCategories = async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from("service_categories")
//             .select("*")
//             .eq("is_active", true);

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to fetch service categories",
//                 error: error.message
//             });
//         }

//         res.status(200).json({
//             success: true,
//             count: data.length,
//             categories: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };


// const getServiceProblems = async (req, res) => {
//     try {
//         const { categoryId } = req.params;

//         const { data, error } = await supabase
//             .from("service_problems")
//             .select("*")
//             .eq("category_id", categoryId)
//             .eq("is_active", true);

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to fetch service problems",
//                 error: error.message
//             });
//         }

//         res.status(200).json({
//             success: true,
//             count: data.length,
//             problems: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };


// const createBooking = async (req, res) => {
//     try {
// const customer_id = req.user.user_id;

// const {
//     category_id,
//     problem_id,
//     issue_description,
//     emergency_flag,
//     emergency_reason,
//     priority,
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
// } = req.body;

//         const { data, error } = await supabase
//             .from("bookings")
//             .insert([
//                 {
//                     customer_id,
//                     category_id,
//                     problem_id,
//                     issue_description,
//                     emergency_flag,
//                     emergency_reason,
//                     priority,
//                     preferred_date,
//                     preferred_time,
//                     anytime_service,
//                     house_number,
//                     apartment_name,
//                     street,
//                     area,
//                     city,
//                     state,
//                     pincode,
//                     booking_status: "Pending"
//                 }
//             ])
//             .select()
//             .single();

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to create booking",
//                 error: error.message
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: "Booking created successfully",
//             booking: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// const getBookingById = async (req, res) => {
//     try {
//         const { bookingId } = req.params;

//         const { data, error } = await supabase
//             .from("bookings")
//             .select(`
//                 *,
//                 service_categories (
//                     category_id,
//                     category_name,
//                     category_image_url
//                 ),
//                 service_problems (
//                     problem_id,
//                     problem_name,
//                     fixed_price
//                 ),
//                 users!fk_booking_customer (
//                     user_id,
//                     full_name,
//                     email,
//                     phone,
//                     address
//                 ),
//                 technicians (
//                     technician_id,
//                     experience,
//                     rating,
//                     availability_status,
//                     profile_picture
//                 ),
//                 payments (
//                     payment_id,
//                     amount,
//                     payment_status,
//                     payment_date
//                 )
//             `)
//             .eq("booking_id", bookingId)
//             .maybeSingle();

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to fetch booking details",
//                 error: error.message
//             });
//         }

//         if (!data) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             booking: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };
// const getCustomerHistory = async (req, res) => {
//     try {
//         const customerId = req.user.user_id;

//         const { data, error } = await supabase
//             .from("bookings")
//             .select(`
//                 booking_id,
//                 created_at,
//                 updated_at,
//                 booking_status,
//                 work_completed_image_url,
//                 service_categories (
//                     category_name
//                 ),
//                 technicians (
//                     technician_id,
//                     experience,
//                     rating,
//                     users (
//                         full_name
//                     )
//                 ),
//                 feedback (
//                     overall_rating
//                 )
//             `)
//             .eq("customer_id", customerId)
//             .eq("booking_status", "Completed")
//             .order("updated_at", { ascending: false });

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to fetch customer history",
//                 error: error.message
//             });
//         }

//         res.status(200).json({
//             success: true,
//             count: data.length,
//             history: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };


// const cancelBooking = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
// const customerId = req.user.user_id;
//         // Check whether the booking exists
//         const { data: booking, error: bookingError } = await supabase
//             .from("bookings")
//             .select("*")
//             .eq("booking_id", bookingId)
//             .eq("customer_id", customerId)
//             .single();

//         if (bookingError || !booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found"
//             });
//         }

//         // Don't allow cancellation of completed/cancelled bookings
//         if (
//             booking.booking_status === "Completed" ||
//             booking.booking_status === "Cancelled"
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Booking cannot be cancelled because it is already ${booking.booking_status}`
//             });
//         }

//         // Update booking status
//         const { data: updatedBooking, error: updateError } = await supabase
//             .from("bookings")
//             .update({
//                 booking_status: "Cancelled",
//                 updated_at: new Date().toISOString()
//             })
//             .eq("booking_id", bookingId)
//             .select()
//             .single();

//         if (updateError) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to cancel booking",
//                 error: updateError.message
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Booking cancelled successfully",
//             booking: updatedBooking
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// const submitFeedback = async (req, res) => {
//     try {
//      const {
//     bookingId,
//     technicianId,
//     overallRating,
//     professionalBehaviour,
//     serviceQuality,
//     timeliness,
//     cleanliness,
//     problemResolution,
//     comments
// } = req.body;

// const customerId = req.user.user_id;
//         // Check whether the booking exists
//         const { data: booking, error: bookingError } = await supabase
//             .from("bookings")
//             .select("booking_id, customer_id, technician_id, booking_status")
//             .eq("booking_id", bookingId)
//             .eq("customer_id", customerId)
//             .single();

//         if (bookingError || !booking) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Booking not found"
//             });
//         }

//         // Feedback should only be submitted after job completion
//         if (booking.booking_status !== "Completed") {
//             return res.status(400).json({
//                 success: false,
//                 message: "Feedback can only be submitted for completed bookings"
//             });
//         }

//         // Check whether feedback already exists
//         const { data: existingFeedback } = await supabase
//             .from("feedback")
//             .select("feedback_id")
//             .eq("booking_id", bookingId)
//             .maybeSingle();

//         if (existingFeedback) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Feedback already submitted for this booking"
//             });
//         }

//         // Insert feedback
//         const { data, error } = await supabase
//             .from("feedback")
//             .insert([
//                 {
//                     booking_id: bookingId,
//                     customer_id: customerId,
//                     technician_id: technicianId,
//                     overall_rating: overallRating,
//                     professional_behaviour: professionalBehaviour,
//                     service_quality: serviceQuality,
//                     timeliness: timeliness,
//                     cleanliness: cleanliness,
//                     problem_resolution: problemResolution,
//                     comments: comments
//                 }
//             ])
//             .select()
//             .single();

//         if (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Failed to submit feedback",
//                 error: error.message
//             });
//         }

//         res.status(201).json({
//             success: true,
//             message: "Feedback submitted successfully",
//             feedback: data
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };
// module.exports = {
//     getServiceCategories, getServiceProblems, createBooking,  getBookingById,getCustomerHistory,  cancelBooking,submitFeedback

// };


// backend/src/controllers/customerController.js
const serviceService = require('../services/serviceService');

// Handlers
const getProfile = async (req, res) => {
  return res.status(200).json({ success: true, message: "Profile endpoint" });
};

const getServiceCategories = async (req, res) => {
  try {
    const categories = await serviceService.fetchServiceCategories();
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getServiceProblems = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const problems = await serviceService.fetchProblemsByCategory(categoryId);
    return res.status(200).json({ success: true, count: problems.length, data: problems });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stubs for future endpoints
const createBooking = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getBookingById = async (req, res) => res.status(501).json({ message: "Not implemented" });
const getCustomerHistory = async (req, res) => res.status(501).json({ message: "Not implemented" });
const cancelBooking = async (req, res) => res.status(501).json({ message: "Not implemented" });
const submitFeedback = async (req, res) => res.status(501).json({ message: "Not implemented" });

module.exports = {
  getProfile,
  getServiceCategories,
  getServiceProblems,
  createBooking,
  getBookingById,
  getCustomerHistory,
  cancelBooking,
  submitFeedback
};