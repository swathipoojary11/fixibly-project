const supabase = require("../config/supabase");

// Helper to get technician_id from user_id
const getTechnicianId = async (userId) => {
  const { data, error } = await supabase
    .from("technicians")
    .select("technician_id")
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data.technician_id;
};

// Get Technician Dashboard Stats
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    if (!technicianId) return res.status(404).json({ success: false, message: "Technician not found" });

    // Get Active Jobs count
    const { count: activeJobsCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("technician_id", technicianId)
      .in("booking_status", ["Assigned", "Accepted", "On The Way", "Arrived", "Working"]);

    // Get Completed Today count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: completedTodayCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("technician_id", technicianId)
      .eq("booking_status", "Completed")
      .gte("updated_at", today.toISOString());

    // Get Emergency Requests count
    const { count: emergencyCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("technician_id", technicianId)
      .eq("emergency_flag", true)
      .neq("booking_status", "Completed")
      .neq("booking_status", "Cancelled");

    res.status(200).json({
      success: true,
      data: {
        active_jobs: activeJobsCount || 0,
        completed_today: completedTodayCount || 0,
        emergency_count: emergencyCount || 0,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Assigned Jobs
const getJobs = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    if (!technicianId) return res.status(404).json({ success: false, message: "Technician not found" });

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        booking_id,
        issue_description,
        booking_status,
        emergency_flag,
        preferred_time,
        street, area, city,
        users (full_name, phone)
      `)
      .eq("technician_id", technicianId)
      .eq("emergency_flag", false)
      .neq("booking_status", "Completed")
      .neq("booking_status", "Cancelled");

    if (error) throw error;

    // Transform to match what frontend expects
    const formattedData = data.map(job => ({
      id: job.booking_id,
      title: job.issue_description || "Service Booking",
      customer: job.users ? job.users.full_name : "Unknown",
      phone: job.users ? job.users.phone : "",
      address: `${job.street}, ${job.area}, ${job.city}`,
      time: job.preferred_time || "Scheduled",
      status: job.booking_status,
      is_emergency: job.emergency_flag
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Emergency Job
const getEmergencyJob = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    if (!technicianId) return res.status(404).json({ success: false, message: "Technician not found" });

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        booking_id,
        issue_description,
        booking_status,
        emergency_flag,
        preferred_time,
        street, area, city,
        users (full_name, phone)
      `)
      .eq("technician_id", technicianId)
      .eq("emergency_flag", true)
      .neq("booking_status", "Completed")
      .neq("booking_status", "Cancelled")
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error; // Ignore no rows found
    
    let formattedData = null;
    if (data) {
      formattedData = {
        id: data.booking_id,
        title: data.issue_description || "Emergency Booking",
        customer: data.users ? data.users.full_name : "Unknown",
        phone: data.users ? data.users.phone : "",
        address: `${data.street}, ${data.area}, ${data.city}`,
        time: data.preferred_time || "Immediate",
        status: data.booking_status,
        is_emergency: data.emergency_flag
      };
    }

    res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Timeline
const getTimeline = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Just returning a dummy timeline since the new schema doesn't have a clear timeline table 
    // and activity_logs might be too complex for a simple timeline.
    const dummyTimeline = [
      { id: 1, time: "09:00", task: "Start of Shift" },
      { id: 2, time: "12:00", task: "Lunch Break" }
    ];
    res.status(200).json({ success: true, data: dummyTimeline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Location
const updateLocation = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { latitude, longitude } = req.body;
    const technicianId = await getTechnicianId(userId);
    
    if (technicianId) {
      const { error } = await supabase
        .from("technician_locations")
        .upsert({ technician_id: technicianId, latitude, longitude, updated_at: new Date() }, { onConflict: 'technician_id' });
      if (error) throw error;
    }

    res.status(200).json({ success: true, message: "Location updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Accept Job
const acceptJob = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    const { id } = req.params;

    const { error } = await supabase
      .from("bookings")
      .update({ booking_status: "Accepted", updated_at: new Date() })
      .eq("booking_id", id)
      .eq("technician_id", technicianId);

    if (error) throw error;
    res.status(200).json({ success: true, message: "Job accepted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel Job
const cancelJob = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    const { id } = req.params;
    const { reason } = req.body;

    const { error } = await supabase
      .from("bookings")
      .update({ booking_status: "Cancelled", cancellation_reason: reason, cancelled_at: new Date(), cancelled_by: userId, updated_at: new Date() })
      .eq("booking_id", id)
      .eq("technician_id", technicianId);

    if (error) throw error;
    res.status(200).json({ success: true, message: "Job cancelled" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Job Status
const updateJobStatus = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const technicianId = await getTechnicianId(userId);
    const { id } = req.params;
    const { status } = req.body;

    const updateData = { booking_status: status, updated_at: new Date() };
    if (status === "Completed") {
      updateData.technician_completed_flag = true;
    }

    const { error } = await supabase
      .from("bookings")
      .update(updateData)
      .eq("booking_id", id)
      .eq("technician_id", technicianId);

    if (error) throw error;
    res.status(200).json({ success: true, message: "Job status updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Map to frontend expectation
    const formattedData = data.map(n => ({
      id: n.notification_id,
      title: n.title,
      message: n.description,
      is_read: n.is_read
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Mark Notification Read
const markNotificationRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { notification_id } = req.body;

    let query = supabase.from("notifications").update({ is_read: true }).eq("user_id", userId);
    
    if (notification_id) {
      query = query.eq("notification_id", notification_id);
    }

    const { error } = await query;
    if (error) throw error;
    res.status(200).json({ success: true, message: "Notification(s) marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getJobs,
  getEmergencyJob,
  getTimeline,
  updateLocation,
  acceptJob,
  cancelJob,
  updateJobStatus,
  getNotifications,
  markNotificationRead
};
