import supabase from "../config/supabase.js";
import { createNotification } from "../services/notificationService.js";
import { logAuditEvent } from "../services/auditService.js";

// GET Service Categories
export const getServiceCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("service_categories")
            .select("*")
            .eq("is_active", true)
            .order("category_id", { ascending: true });

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch service categories",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            count: data.length,
            categories: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// GET Service Problems for Category
export const getServiceProblems = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const { data, error } = await supabase
            .from("service_problems")
            .select("*")
            .eq("category_id", categoryId)
            .eq("is_active", true);

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch service problems",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            count: data.length,
            problems: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// GET Customer Dashboard Summary
export const getCustomerDashboard = async (req, res) => {
    try {
        const customerId = req.user.user_id;

        const { data: user } = await supabase
            .from("users")
            .select("full_name, email, phone, address")
            .eq("user_id", customerId)
            .single();

        const { data: bookings } = await supabase
            .from("bookings")
            .select(`
                *,
                service_categories (category_name, category_image_url),
                service_problems (problem_name, fixed_price),
                technicians (technician_id, rating, users(full_name, phone))
            `)
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false });

        const recentBookings = (bookings || []).filter(b => b.booking_status !== 'Completed' && b.booking_status !== 'Cancelled');
        const historyPreview = (bookings || []).filter(b => b.booking_status === 'Completed' || b.booking_status === 'Cancelled').slice(0, 5);

        const statistics = {
            totalBookings: (bookings || []).length,
            activeBookings: recentBookings.length,
            completedBookings: (bookings || []).filter(b => b.booking_status === 'Completed').length,
            cancelledBookings: (bookings || []).filter(b => b.booking_status === 'Cancelled').length,
            emergencyBookings: (bookings || []).filter(b => b.emergency_flag).length
        };

        const { data: categories } = await supabase
            .from("service_categories")
            .select("*")
            .eq("is_active", true);

        res.status(200).json({
            success: true,
            customer: user,
            recentBookings,
            historyPreview,
            statistics,
            categories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST Calculate Booking Summary Review
export const getBookingSummary = async (req, res) => {
    try {
        const customerId = req.user.user_id;
        const { category_id, problem_id, emergency_flag, custom_problem_description } = req.body;

        const { data: user } = await supabase
            .from("users")
            .select("user_id, full_name, email, phone, address")
            .eq("user_id", customerId)
            .single();

        const { data: category } = await supabase
            .from("service_categories")
            .select("category_id, category_name")
            .eq("category_id", category_id)
            .single();

        let problem = null;
        let estimatedCost = 0;
        let isInspectionRequired = false;

        if (problem_id) {
            const { data: probData } = await supabase
                .from("service_problems")
                .select("problem_id, problem_name, fixed_price")
                .eq("problem_id", problem_id)
                .single();
            problem = probData;
            if (probData?.fixed_price) {
                estimatedCost = Number(probData.fixed_price);
            } else {
                isInspectionRequired = true;
            }
        } else {
            isInspectionRequired = true;
        }

        const emergencyCharge = emergency_flag ? 300 : 0;
        const grandTotal = estimatedCost + emergencyCharge;

        res.status(200).json({
            success: true,
            summary: {
                customer: user,
                category,
                problem,
                customDescription: custom_problem_description || null,
                estimatedCost: isInspectionRequired ? "Pending inspection" : estimatedCost,
                emergencyCharge,
                grandTotal: isInspectionRequired ? "Pending final inspection" : grandTotal,
                isInspectionRequired
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST Create Booking
export const createBooking = async (req, res) => {
    try {
        const customer_id = req.user.user_id;

        const {
            category_id,
            problem_id,
            issue_description,
            emergency_flag,
            emergency_reason,
            priority,
            preferred_date,
            preferred_time,
            anytime_service,
            house_number,
            apartment_name,
            street,
            area,
            city,
            state,
            pincode
        } = req.body;

        if (!category_id || (!street && !area)) {
            return res.status(400).json({
                success: false,
                message: "Category and location details are required."
            });
        }

        if (emergency_flag && !emergency_reason) {
            return res.status(400).json({
                success: false,
                message: "Emergency reason is required for emergency bookings."
            });
        }

        const { data, error } = await supabase
            .from("bookings")
            .insert([
                {
                    customer_id,
                    category_id: Number(category_id),
                    problem_id: problem_id ? Number(problem_id) : null,
                    issue_description: issue_description || "",
                    emergency_flag: Boolean(emergency_flag),
                    emergency_reason: emergency_reason || null,
                    priority: emergency_flag ? "Emergency" : (priority || "Normal"),
                    preferred_date: preferred_date || null,
                    preferred_time: preferred_time || null,
                    anytime_service: Boolean(anytime_service),
                    house_number: house_number || "",
                    apartment_name: apartment_name || "",
                    street: street || "Main Street",
                    area: area || "Central Area",
                    city: city || "City",
                    state: state || "State",
                    pincode: pincode || "575001",
                    booking_status: "Pending"
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to create booking",
                error: error.message
            });
        }

        // Notify Dispatchers
        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId: data.booking_id,
            title: emergency_flag ? '🚨 EMERGENCY BOOKING INTAKE' : 'New Service Booking',
            description: `New ${emergency_flag ? 'Emergency ' : ''}Booking #${data.booking_id} created by customer.`,
            notificationType: emergency_flag ? 'Emergency' : 'Booking',
            priority: emergency_flag ? 'High' : 'Medium'
        });

        // Notify Available Technicians if Emergency
        if (emergency_flag) {
            await createNotification({
                recipientRole: 'TECHNICIAN',
                bookingId: data.booking_id,
                title: '🚨 Emergency Service Required',
                description: `Urgent emergency job #${data.booking_id} created in area ${data.area || data.city}`,
                notificationType: 'Emergency',
                priority: 'High'
            });
        }

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// GET Single Booking Details
export const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const { data, error } = await supabase
            .from("bookings")
            .select(`
                *,
                service_categories (
                    category_id,
                    category_name,
                    category_image_url
                ),
                service_problems (
                    problem_id,
                    problem_name,
                    fixed_price
                ),
                users!fk_booking_customer (
                    user_id,
                    full_name,
                    email,
                    phone,
                    address
                ),
                technicians (
                    technician_id,
                    experience,
                    rating,
                    availability_status,
                    profile_picture,
                    users (
                        full_name,
                        phone,
                        email
                    )
                ),
                payments (
                    payment_id,
                    amount,
                    payment_status,
                    payment_type,
                    payment_date
                )
            `)
            .eq("booking_id", bookingId)
            .maybeSingle();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            booking: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// GET Live Tracking Details
export const getBookingTracking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const { data: booking, error } = await supabase
            .from("bookings")
            .select(`
                booking_id,
                booking_status,
                estimated_arrival,
                created_at,
                updated_at,
                customer_completed_flag,
                technician_completed_flag,
                technicians (
                    technician_id,
                    rating,
                    availability_status,
                    users (
                        full_name,
                        phone
                    )
                )
            `)
            .eq("booking_id", bookingId)
            .maybeSingle();

        if (error || !booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        let technicianLocation = null;
        if (booking.technicians?.technician_id) {
            const { data: loc } = await supabase
                .from("technician_locations")
                .select("latitude, longitude, updated_at")
                .eq("technician_id", booking.technicians.technician_id)
                .order("updated_at", { ascending: false })
                .limit(1)
                .maybeSingle();
            technicianLocation = loc;
        }

        res.status(200).json({
            success: true,
            tracking: {
                bookingId: booking.booking_id,
                currentStatus: booking.booking_status,
                estimatedArrival: booking.estimated_arrival,
                technician: booking.technicians,
                technicianLocation,
                customerCompletedFlag: booking.customer_completed_flag,
                technicianCompletedFlag: booking.technician_completed_flag,
                lastUpdated: booking.updated_at
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH Customer Handshake Completion Confirmation
export const confirmCompletion = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const customerId = req.user.user_id;

        const { data: booking, error: fetchErr } = await supabase
            .from("bookings")
            .select("*")
            .eq("booking_id", bookingId)
            .eq("customer_id", customerId)
            .single();

        if (fetchErr || !booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.booking_status !== "Waiting for Customer Confirmation" && booking.booking_status !== "Working") {
            return res.status(400).json({
                success: false,
                message: `Booking is in '${booking.booking_status}' state. Confirmation is only available when work is finished by technician.`
            });
        }

        // Finalize status to Completed
        const { data: updatedBooking, error: updateErr } = await supabase
            .from("bookings")
            .update({
                booking_status: "Completed",
                customer_completed_flag: true,
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (updateErr) throw updateErr;

        // Restore Technician availability to Available
        if (booking.technician_id) {
            await supabase
                .from("technicians")
                .update({ availability_status: "Available" })
                .eq("technician_id", booking.technician_id);

            // Notify Technician of confirmation
            await createNotification({
                recipientRole: 'TECHNICIAN',
                userId: booking.technician_id,
                bookingId,
                title: 'Job Completed & Confirmed',
                description: `Customer confirmed completion for Booking #${bookingId}! Your status is back to Available.`,
                notificationType: 'Assignment',
                priority: 'Low'
            });
        }

        // Notify Dispatcher & Admin
        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId,
            title: 'Booking Completed',
            description: `Customer confirmed completion for Booking #${bookingId}.`,
            notificationType: 'Booking',
            priority: 'Low'
        });

        res.status(200).json({
            success: true,
            message: "Work completion confirmed! Booking is now Completed.",
            booking: updatedBooking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET Customer History
export const getCustomerHistory = async (req, res) => {
    try {
        const customerId = req.user.user_id;

        const { data, error } = await supabase
            .from("bookings")
            .select(`
                booking_id,
                created_at,
                updated_at,
                booking_status,
                emergency_flag,
                issue_description,
                street,
                area,
                city,
                work_completed_image_url,
                service_categories (
                    category_name
                ),
                service_problems (
                    problem_name
                ),
                technicians (
                    technician_id,
                    experience,
                    rating,
                    users (
                        full_name
                    )
                ),
                feedback (
                    overall_rating,
                    comments
                )
            `)
            .eq("customer_id", customerId)
            .in("booking_status", ["Completed", "Cancelled"])
            .order("updated_at", { ascending: false });

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch customer history",
                error: error.message
            });
        }

        res.status(200).json({
            success: true,
            count: data.length,
            history: data
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// PATCH Cancel Booking
export const cancelBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const customerId = req.user.user_id;

        const { data: booking, error: bookingError } = await supabase
            .from("bookings")
            .select("*")
            .eq("booking_id", bookingId)
            .eq("customer_id", customerId)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.booking_status === "Completed" || booking.booking_status === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: `Booking cannot be cancelled because it is already ${booking.booking_status}`
            });
        }

        // Window check: if estimated arrival exists and is within 40 minutes, reject
        if (booking.estimated_arrival) {
            const etaTime = new Date(booking.estimated_arrival).getTime();
            const nowTime = new Date().getTime();
            const diffMinutes = (etaTime - nowTime) / (1000 * 60);
            if (diffMinutes < 40 && diffMinutes > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cancellation is only allowed up to 40 minutes before estimated arrival time."
                });
            }
        }

        const { data: updatedBooking, error: updateError } = await supabase
            .from("bookings")
            .update({
                booking_status: "Cancelled",
                cancelled_at: new Date().toISOString(),
                cancelled_by: customerId,
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (updateError) throw updateError;

        // If technician was assigned, set availability back to Available and notify
        if (booking.technician_id) {
            await supabase
                .from("technicians")
                .update({ availability_status: "Available" })
                .eq("technician_id", booking.technician_id);

            await createNotification({
                recipientRole: 'TECHNICIAN',
                userId: booking.technician_id,
                bookingId,
                title: 'Job Cancelled by Customer',
                description: `Booking #${bookingId} was cancelled by customer.`,
                notificationType: 'Cancellation',
                priority: 'High'
            });
        }

        // Notify Dispatcher
        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId,
            title: 'Booking Cancelled',
            description: `Booking #${bookingId} was cancelled by customer.`,
            notificationType: 'Cancellation',
            priority: 'Medium'
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking: updatedBooking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

// POST Technician Feedback
export const submitFeedback = async (req, res) => {
    try {
        const {
            bookingId,
            technicianId,
            overallRating,
            professionalBehaviour,
            serviceQuality,
            timeliness,
            cleanliness,
            problemResolution,
            comments
        } = req.body;

        const customerId = req.user.user_id;

        const { data: booking } = await supabase
            .from("bookings")
            .select("booking_id, customer_id, technician_id, booking_status")
            .eq("booking_id", bookingId)
            .eq("customer_id", customerId)
            .single();

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        if (booking.booking_status !== "Completed") {
            return res.status(400).json({
                success: false,
                message: "Feedback can only be submitted for completed bookings"
            });
        }

        const { data: existingFeedback } = await supabase
            .from("feedback")
            .select("feedback_id")
            .eq("booking_id", bookingId)
            .maybeSingle();

        if (existingFeedback) {
            return res.status(400).json({
                success: false,
                message: "Feedback already submitted for this booking"
            });
        }

        const targetTechId = technicianId || booking.technician_id;

        const { data, error } = await supabase
            .from("feedback")
            .insert([
                {
                    booking_id: bookingId,
                    customer_id: customerId,
                    technician_id: targetTechId,
                    overall_rating: overallRating || 5,
                    professional_behaviour: professionalBehaviour || 5,
                    service_quality: serviceQuality || 5,
                    timeliness: timeliness || 5,
                    cleanliness: cleanliness || 5,
                    problem_resolution: problemResolution || 5,
                    comments: comments || ""
                }
            ])
            .select()
            .single();

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        // Recalculate average technician rating
        if (targetTechId) {
            const { data: allFb } = await supabase
                .from("feedback")
                .select("overall_rating")
                .eq("technician_id", targetTechId);

            if (allFb && allFb.length > 0) {
                const avgRating = (allFb.reduce((acc, f) => acc + f.overall_rating, 0) / allFb.length).toFixed(1);
                await supabase
                    .from("technicians")
                    .update({ rating: parseFloat(avgRating) })
                    .eq("technician_id", targetTechId);
            }
        }

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            feedback: data
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST Platform Feedback
export const submitPlatformFeedback = async (req, res) => {
    try {
        const customerId = req.user.user_id;
        const { rating, comments } = req.body;

        const { data, error } = await supabase
            .from("app_feedback")
            .upsert([
                {
                    customer_id: customerId,
                    rating: rating || 5,
                    comments: comments || ""
                }
            ])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            message: "Platform feedback submitted successfully",
            feedback: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default {
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
};