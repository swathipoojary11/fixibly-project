const supabase = require("../config/supabase");

// =========================
// PROFILE
// =========================
const getProfile = async (userId) => {
    const { data: technician, error } = await supabase
        .from("technicians")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) throw error;

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

// =========================
// ASSIGNED JOBS
// =========================
const getJobs = async (technicianId) => {
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("technician_id", technicianId);

    if (error) throw error;

    const result = [];

    for (const booking of bookings) {
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

// =========================
// EMERGENCY JOBS
// =========================
const getEmergencyJobs = async () => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("priority", "Emergency")
        .eq("booking_status", "Pending")
        .is("technician_id", null);

    if (error) throw error;

    return data;
};

// =========================
// ACCEPT JOB
// =========================
const acceptJob = async (technicianId, bookingId) => {
    const { data, error } = await supabase
        .from("bookings")
        .update({
            booking_status: "Accepted",
            updated_at: new Date()
        })
        .eq("booking_id", bookingId)
        .eq("technician_id", technicianId)
        .select()
        .single();

    if (error) throw error;

    await supabase
        .from("technicians")
        .update({ availability_status: "Busy" })
        .eq("technician_id", technicianId);

    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status: "Accepted" });

    return data;
};

// =========================
// REJECT JOB
// =========================
const rejectJob = async (technicianId, bookingId) => {
    const { data, error } = await supabase
        .from("bookings")
        .update({
            technician_id: null,
            booking_status: "Pending",
            updated_at: new Date()
        })
        .eq("booking_id", bookingId)
        .eq("technician_id", technicianId)
        .select()
        .single();

    if (error) throw error;

    await supabase
        .from("technicians")
        .update({ availability_status: "Available" })
        .eq("technician_id", technicianId);

    return data;
};

// =========================
// ACCEPT EMERGENCY JOB
// =========================
const acceptEmergency = async (technicianId, bookingId) => {
    const { data, error } = await supabase
        .from("bookings")
        .update({
            technician_id: technicianId,
            booking_status: "Accepted",
            updated_at: new Date()
        })
        .eq("booking_id", bookingId)
        .eq("booking_status", "Pending")
        .is("technician_id", null)
        .select()
        .single();

    if (error) throw error;
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

// =========================
// UPDATE AVAILABILITY
// =========================
const updateAvailability = async (technicianId, status) => {
    const { data, error } = await supabase
        .from("technicians")
        .update({ availability_status: status, updated_at: new Date() })
        .eq("technician_id", technicianId)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// =========================
// UPDATE LOCATION
// =========================
const updateLocation = async (technicianId, latitude, longitude) => {
    const { data, error } = await supabase
        .from("technician_locations")
        .upsert(
            {
                technician_id: technicianId,
                latitude,
                longitude,
                updated_at: new Date()
            },
            { onConflict: "technician_id" }
        )
        .select()
        .single();

    if (error) throw error;

    return data;
};

// =========================
// UPDATE JOB STATUS
// =========================
const updateJobStatus = async (bookingId, status) => {
    const { data, error } = await supabase
        .from("bookings")
        .update({ booking_status: status, updated_at: new Date() })
        .eq("booking_id", bookingId)
        .select()
        .single();

    if (error) throw error;

    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status });

    return data;
};

// =========================
// GET NOTIFICATIONS
// =========================
const getNotifications = async (userId) => {
    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .or(`user_id.eq.${userId},recipient_role.eq.TECHNICIAN,recipient_role.eq.ALL`)
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
};

// =========================
// MARK NOTIFICATION READ
// =========================
const markNotificationRead = async (notificationId) => {
    const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("notification_id", notificationId)
        .select()
        .single();

    if (error) throw error;

    return data;
};

// =========================
// COMPLETE JOB
// =========================
const completeJob = async (bookingId) => {
    const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .select("customer_completed_flag")
        .eq("booking_id", bookingId)
        .single();

    if (bookingError) throw bookingError;

    if (!booking.customer_completed_flag) {
        throw new Error("Customer has not confirmed completion.");
    }

    const { data, error } = await supabase
        .from("bookings")
        .update({
            booking_status: "Completed",
            technician_completed_flag: true,
            updated_at: new Date()
        })
        .eq("booking_id", bookingId)
        .select()
        .single();

    if (error) throw error;

    await supabase
        .from("booking_status_history")
        .insert({ booking_id: bookingId, status: "Completed" });

    return data;
};

// =========================
// EXPORTS
// =========================
module.exports = {
    getProfile,
    getJobs,
    getEmergencyJobs,
    acceptJob,
    rejectJob,
    updateAvailability,
    updateLocation,
    updateJobStatus,
    acceptEmergency,
    getNotifications,
    markNotificationRead,
    completeJob
};
