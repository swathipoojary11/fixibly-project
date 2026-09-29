"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceCategory = exports.getServiceCategories = exports.completeJob = exports.markNotificationRead = exports.getNotifications = exports.updateJobStatus = exports.updateLocation = exports.updateAvailability = exports.acceptEmergency = exports.rejectJob = exports.acceptJob = exports.getEmergencyJobs = exports.getJobs = exports.getProfile = void 0;
const supabase = require("../config/supabase");
// ==========================================
// 2. PROFILE
// ==========================================
const getProfile = async (userId) => {
    if (!userId)
        throw new Error("USER_ID_REQUIRED");
    const { data: technician, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (error)
        throw error;
    const { data: user } = await supabase
        .from("users")
        .select("full_name,email,phone,address")
        .eq("user_id", userId)
        .single();
    const { data: category } = await supabase
        .from("service_categories")
        .select("category_name")
        .eq("category_id", technician.category_id)
        .single();
    return {
        ...technician,
        user,
        category
    };
};
exports.getProfile = getProfile;
// ==========================================
// 3. ASSIGNED JOBS
// ==========================================
const getJobs = async (technicianId) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("technician_id", technicianId);
    if (error)
        throw error;
    const rawBookings = bookings || [];
    const result = [];
    for (const booking of rawBookings) {
        const { data: customer } = await supabase
            .from("users")
            .select("full_name,email,phone,address")
            .eq("user_id", booking.customer_id)
            .single();
        const { data: category } = await supabase
            .from("service_categories")
            .select("category_name")
            .eq("category_id", booking.category_id)
            .single();
        let problem = null;
        if (booking.problem_id) {
            const response = await supabase
                .from("service_problems")
                .select("problem_name,fixed_price")
                .eq("problem_id", booking.problem_id)
                .single();
            problem = response.data;
        }
        result.push({
            ...booking,
            customer,
            category,
            problem
        });
    }
    return result;
};
exports.getJobs = getJobs;
// ==========================================
// 4. EMERGENCY JOBS
// ==========================================
const getEmergencyJobs = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("priority", "Emergency")
        .eq("booking_status", "Pending")
        .is("technician_id", null);
    if (error)
        throw error;
    return data || [];
};
exports.getEmergencyJobs = getEmergencyJobs;
// ==========================================
// 5. ACCEPT JOB
// ==========================================
const acceptJob = async (technicianId, bookingId) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("bookings")
        .update({
        booking_status: "Accepted",
        updated_at: new Date().toISOString()
    })
        .eq("booking_id", bookingId)
        .eq("technician_id", technicianId)
        .select()
        .single();
    if (error)
        throw error;
    await supabase
        .from("technicians")
        .update({ availability_status: "Busy" })
        .eq("technician_id", technicianId);
    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status: "Accepted" });
    return data;
};
exports.acceptJob = acceptJob;
// ==========================================
// 6. REJECT JOB
// ==========================================
const rejectJob = async (technicianId, bookingId) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("bookings")
        .update({
        technician_id: null,
        booking_status: "Pending",
        updated_at: new Date().toISOString()
    })
        .eq("booking_id", bookingId)
        .eq("technician_id", technicianId)
        .select()
        .single();
    if (error)
        throw error;
    await supabase
        .from("technicians")
        .update({ availability_status: "Available" })
        .eq("technician_id", technicianId);
    return data;
};
exports.rejectJob = rejectJob;
// ==========================================
// 7. ACCEPT EMERGENCY JOB
// ==========================================
const acceptEmergency = async (technicianId, bookingId) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("bookings")
        .update({
        technician_id: technicianId,
        booking_status: "Accepted",
        updated_at: new Date().toISOString()
    })
        .eq("booking_id", bookingId)
        .eq("booking_status", "Pending")
        .is("technician_id", null)
        .select()
        .single();
    if (error)
        throw error;
    if (!data) {
        throw new Error("This emergency job was already claimed by another technician.");
    }
    await supabase
        .from("technicians")
        .update({ availability_status: "Busy" })
        .eq("technician_id", technicianId);
    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status: "Accepted" });
    return data;
};
exports.acceptEmergency = acceptEmergency;
// ==========================================
// 8. UPDATE AVAILABILITY
// ==========================================
const updateAvailability = async (technicianId, status) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("technicians")
        .update({
        availability_status: status || "Available",
        updated_at: new Date().toISOString()
    })
        .eq("technician_id", technicianId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateAvailability = updateAvailability;
// ==========================================
// 9. UPDATE LOCATION
// ==========================================
const updateLocation = async (technicianId, latitude, longitude) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("technician_locations")
        .upsert({
        technician_id: technicianId,
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        updated_at: new Date().toISOString()
    }, { onConflict: "technician_id" })
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateLocation = updateLocation;
// ==========================================
// 10. UPDATE JOB STATUS
// ==========================================
const updateJobStatus = async (bookingId, status) => {
    const { data, error } = await supabase
        .from("bookings")
        .update({
        booking_status: status,
        updated_at: new Date().toISOString()
    })
        .eq("booking_id", bookingId)
        .select()
        .single();
    if (error)
        throw error;
    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status });
    return data;
};
exports.updateJobStatus = updateJobStatus;
// ==========================================
// 11. GET NOTIFICATIONS
// ==========================================
const getNotifications = async (userId) => {
    if (!userId)
        throw new Error("USER_ID_REQUIRED");
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},recipient_role.eq.TECHNICIAN,recipient_role.eq.ALL`)
        .order("created_at", { ascending: false });
    if (error)
        throw error;
    return data || [];
};
exports.getNotifications = getNotifications;
// ==========================================
// 12. MARK NOTIFICATION READ
// ==========================================
const markNotificationRead = async (notificationId) => {
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("notification_id", notificationId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.markNotificationRead = markNotificationRead;
// ==========================================
// 13. COMPLETE JOB
// ==========================================
const completeJob = async (bookingId) => {
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("customer_completed_flag")
        .eq("booking_id", bookingId)
        .single();
    if (bookingError)
        throw bookingError;
    if (!booking?.customer_completed_flag) {
        throw new Error("Customer has not confirmed completion.");
    }
    const { data, error } = await supabase
        .from("bookings")
        .update({
        booking_status: "Completed",
        technician_completed_flag: true,
        updated_at: new Date().toISOString()
    })
        .eq("booking_id", bookingId)
        .select()
        .single();
    if (error)
        throw error;
    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status: "Completed" });
    return data;
};
exports.completeJob = completeJob;
// ==========================================
// 14. SERVICE CATEGORIES
// ==========================================
const getServiceCategories = async () => {
    const { data, error } = await supabase
        .from("service_categories")
        .select("category_id, category_name")
        .eq("is_active", true)
        .order("category_name");
    if (error)
        throw error;
    return data || [];
};
exports.getServiceCategories = getServiceCategories;
const updateServiceCategory = async (technicianId, categoryId) => {
    if (!technicianId)
        throw new Error("TECHNICIAN_ID_REQUIRED");
    const { data, error } = await supabase
        .from("technicians")
        .update({
        category_id: categoryId,
        updated_at: new Date().toISOString()
    })
        .eq("technician_id", technicianId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
};
exports.updateServiceCategory = updateServiceCategory;
// Default export bundle so `import technicianService from ...` also works
exports.default = {
    getProfile: exports.getProfile,
    getJobs: exports.getJobs,
    getEmergencyJobs: exports.getEmergencyJobs,
    acceptJob: exports.acceptJob,
    rejectJob: exports.rejectJob,
    updateAvailability: exports.updateAvailability,
    updateLocation: exports.updateLocation,
    updateJobStatus: exports.updateJobStatus,
    acceptEmergency: exports.acceptEmergency,
    getNotifications: exports.getNotifications,
    markNotificationRead: exports.markNotificationRead,
    completeJob: exports.completeJob,
    getServiceCategories: exports.getServiceCategories,
    updateServiceCategory: exports.updateServiceCategory
};
//# sourceMappingURL=technicianService.js.map