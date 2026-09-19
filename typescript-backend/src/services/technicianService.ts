const supabase = require("../config/supabase");

// =========================
// PROFILE
// =========================
// ==========================================

type IdType = string | number;

type AvailabilityStatus = "Available" | "Busy" | "Offline" | string;

// Generic DB record helper
type DbRecord = Record<string, any>;

// ==========================================
// 2. PROFILE
// ==========================================

export const getProfile = async (userId: IdType | undefined) => {
  if (!userId) throw new Error("USER_ID_REQUIRED");

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

// ==========================================
// 3. ASSIGNED JOBS
// ==========================================

export const getJobs = async (technicianId: IdType | undefined) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("technician_id", technicianId);

  if (error) throw error;

  const rawBookings: DbRecord[] = bookings || [];
  const result: DbRecord[] = [];

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

// ==========================================
// 4. EMERGENCY JOBS
// ==========================================

export const getEmergencyJobs = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("priority", "Emergency")
    .eq("booking_status", "Pending")
    .is("technician_id", null);

  if (error) throw error;

  return data || [];
};

// ==========================================
// 5. ACCEPT JOB
// ==========================================

export const acceptJob = async (technicianId: IdType | undefined, bookingId: IdType) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

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

// ==========================================
// 6. REJECT JOB
// ==========================================

export const rejectJob = async (technicianId: IdType | undefined, bookingId: IdType) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

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

  if (error) throw error;

  await supabase
    .from("technicians")
    .update({ availability_status: "Available" })
    .eq("technician_id", technicianId);

  return data;
};

// ==========================================
// 7. ACCEPT EMERGENCY JOB
// ==========================================

export const acceptEmergency = async (technicianId: IdType | undefined, bookingId: IdType) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

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

// ==========================================
// 8. UPDATE AVAILABILITY
// ==========================================

export const updateAvailability = async (
  technicianId: IdType | undefined,
  status?: AvailabilityStatus
) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

  const { data, error } = await supabase
    .from("technicians")
    .update({
      availability_status: status || "Available",
      updated_at: new Date().toISOString()
    })
    .eq("technician_id", technicianId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ==========================================
// 9. UPDATE LOCATION
// ==========================================

export const updateLocation = async (
  technicianId: IdType | undefined,
  latitude?: number,
  longitude?: number
) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

  const { data, error } = await supabase
    .from("technician_locations")
    .upsert(
      {
        technician_id: technicianId,
        latitude: Number(latitude) || 0,
        longitude: Number(longitude) || 0,
        updated_at: new Date().toISOString()
      },
      { onConflict: "technician_id" }
    )
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ==========================================
// 10. UPDATE JOB STATUS
// ==========================================

export const updateJobStatus = async (bookingId: IdType, status?: string) => {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      booking_status: status,
      updated_at: new Date().toISOString()
    })
    .eq("booking_id", bookingId)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from("booking_status_history")
    .insert({ booking_id: bookingId, status });

  return data;
};

// ==========================================
// 11. GET NOTIFICATIONS
// ==========================================

export const getNotifications = async (userId: IdType | undefined) => {
  if (!userId) throw new Error("USER_ID_REQUIRED");

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .or(`user_id.eq.${userId},recipient_role.eq.TECHNICIAN,recipient_role.eq.ALL`)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};

// ==========================================
// 12. MARK NOTIFICATION READ
// ==========================================

export const markNotificationRead = async (notificationId: IdType) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("notification_id", notificationId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// ==========================================
// 13. COMPLETE JOB
// ==========================================

export const completeJob = async (bookingId: IdType) => {
  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("customer_completed_flag")
    .eq("booking_id", bookingId)
    .single();

  if (bookingError) throw bookingError;

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

  if (error) throw error;

  await supabase
    .from("booking_status_history")
    .insert({ booking_id: bookingId, status: "Completed" });

  return data;
};

// ==========================================
// 14. SERVICE CATEGORIES
// ==========================================

export const getServiceCategories = async () => {
  const { data, error } = await supabase
    .from("service_categories")
    .select("category_id, category_name")
    .eq("is_active", true)
    .order("category_name");

  if (error) throw error;

  return data || [];
};

export const updateServiceCategory = async (
  technicianId: IdType | undefined,
  categoryId: IdType | undefined
) => {
  if (!technicianId) throw new Error("TECHNICIAN_ID_REQUIRED");

  const { data, error } = await supabase
    .from("technicians")
    .update({
      category_id: categoryId,
      updated_at: new Date().toISOString()
    })
    .eq("technician_id", technicianId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

// Default export bundle so `import technicianService from ...` also works
export default {
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
  completeJob,
  getServiceCategories,
  updateServiceCategory
};