import supabase from "../config/supabase.js";
import { createNotification } from "../services/notificationService.js";
import { logAuditEvent } from "../services/auditService.js";

// Helper: resolve technician record from logged-in user_id
const getTechnicianRecord = async (userId) => {
    let { data: tech } = await supabase
        .from("technicians")
        .select("*, service_categories(category_name), users(full_name, email, phone, address)")
        .eq("user_id", userId)
        .maybeSingle();

    if (!tech) {
        // Auto-provision technician record if missing
        const { data: categoryData } = await supabase.from("service_categories").select("category_id").limit(1).single();
        const { data: newTech } = await supabase
            .from("technicians")
            .insert([{
                user_id: userId,
                category_id: categoryData?.category_id || 1,
                experience: 3,
                rating: 5.0,
                availability_status: "Available"
            }])
            .select("*, service_categories(category_name), users(full_name, email, phone, address)")
            .single();
        tech = newTech;
    }
    return tech;
};

// GET Technician Profile & Summary Stats
export const profile = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        // Fetch metrics
        const { data: assignedJobs } = await supabase
            .from("bookings")
            .select("booking_id, booking_status, emergency_flag")
            .eq("technician_id", tech.technician_id);

        const assignedCount = (assignedJobs || []).filter(j => j.booking_status !== "Completed" && j.booking_status !== "Cancelled").length;
        const emergencyCount = (assignedJobs || []).filter(j => j.emergency_flag && j.booking_status !== "Completed" && j.booking_status !== "Cancelled").length;
        const completedCount = (assignedJobs || []).filter(j => j.booking_status === "Completed").length;

        res.json({
            success: true,
            data: {
                technician_id: tech.technician_id,
                user_id: tech.user_id,
                name: tech.users?.full_name || "Technician Specialist",
                full_name: tech.users?.full_name || "Technician Specialist",
                email: tech.users?.email,
                phone: tech.users?.phone,
                role: `${tech.service_categories?.category_name || "Field"} Specialist`,
                category_id: tech.category_id,
                category: tech.service_categories?.category_name || "General",
                experience: tech.experience || 3,
                rating: tech.rating || 5.0,
                availability: tech.availability_status || "Available",
                availability_status: tech.availability_status || "Available",
                status: tech.availability_status || "Available",
                assignedJobsCount: assignedCount,
                emergencyJobsCount: emergencyCount,
                completedJobsCount: completedCount,
                profile_picture: tech.profile_picture
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Technician Dashboard Stats (active, completed_today, emergency_count)
export const dashboard = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        const { data: assignedJobs } = await supabase
            .from("bookings")
            .select("booking_id, booking_status, emergency_flag")
            .eq("technician_id", tech.technician_id);

        const activeJobs = (assignedJobs || []).filter(j => j.booking_status !== "Completed" && j.booking_status !== "Cancelled").length;
        const completedToday = (assignedJobs || []).filter(j => j.booking_status === "Completed").length;
        const emergencyCount = (assignedJobs || []).filter(j => j.emergency_flag && j.booking_status !== "Completed" && j.booking_status !== "Cancelled").length;

        res.json({
            success: true,
            data: {
                active_jobs: activeJobs,
                completed_today: completedToday,
                emergency_count: emergencyCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Assigned Jobs
export const jobs = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        const { data: bookingList, error } = await supabase
            .from("bookings")
            .select(`
                *,
                service_categories (category_name),
                service_problems (problem_name, fixed_price),
                users!customer_id (user_id, full_name, email, phone, address)
            `)
            .or(`technician_id.eq.${tech.technician_id},technician_id.eq.${userId}`)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        const formattedJobs = (bookingList || []).map(j => ({
            ...j,
            id: j.booking_id,
            job_code: `BK-${j.booking_id}`,
            title: j.service_problems?.problem_name || j.issue_description || "Field Repair Service",
            category: j.service_categories?.category_name || "General",
            priority: j.priority || (j.emergency_flag ? "High Priority" : "Normal"),
            customer: j.users?.full_name || "Customer",
            customer_name: j.users?.full_name || "Customer",
            customer_phone: j.users?.phone || "N/A",
            service_address: `${j.street || ''} ${j.area || ''}, ${j.city || 'Mangalore'}`.trim(),
            address: `${j.street || ''} ${j.area || ''}, ${j.city || 'Mangalore'}`.trim(),
            scheduled_at: j.preferred_date || j.created_at,
            time: j.anytime_service ? "Anytime" : (j.preferred_time || "Standard Slot"),
            status: j.booking_status,
            description: j.issue_description
        }));

        res.json({
            success: true,
            data: formattedJobs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Single Job Details for Technician
export const jobDetails = async (req, res) => {
    try {
        const { id: bookingId } = req.params;
        const { data: booking, error } = await supabase
            .from("bookings")
            .select(`
                *,
                service_categories (category_name),
                service_problems (problem_name, fixed_price),
                users!customer_id (user_id, full_name, email, phone, address)
            `)
            .eq("booking_id", bookingId)
            .single();

        if (error || !booking) {
            return res.status(404).json({ success: false, message: "Job details not found" });
        }

        res.json({
            success: true,
            booking,
            data: booking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Today's Schedule Timeline
export const timeline = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        const { data: assignedJobs } = await supabase
            .from("bookings")
            .select(`
                booking_id,
                booking_status,
                preferred_time,
                preferred_date,
                anytime_service,
                street,
                area,
                city,
                service_categories(category_name),
                service_problems(problem_name)
            `)
            .or(`technician_id.eq.${tech.technician_id},technician_id.eq.${userId}`)
            .order("updated_at", { ascending: false });

        const formattedTimeline = (assignedJobs || []).map(j => ({
            time: j.anytime_service ? "Anytime" : (j.preferred_time || "10:30 AM"),
            task: `${j.service_problems?.problem_name || j.service_categories?.category_name || 'Service'} at ${j.street || j.area || j.city || 'Site Location'}`
        }));

        res.json({
            success: true,
            data: formattedTimeline.length > 0 ? formattedTimeline : [{ time: "Today", task: "No active dispatch schedule" }]
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Availability Toggle
export const availability = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { status } = req.body;
        const tech = await getTechnicianRecord(userId);

        const validStatuses = ["Available", "Busy", "Closed", "Offline"];
        const newStatus = validStatuses.find(s => s.toLowerCase() === (status || '').toLowerCase()) || "Available";

        const { data: updatedTech, error } = await supabase
            .from("technicians")
            .update({ availability_status: newStatus, updated_at: new Date().toISOString() })
            .eq("technician_id", tech.technician_id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: updatedTech
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH GPS Location Ping
export const location = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { latitude, longitude } = req.body;
        const tech = await getTechnicianRecord(userId);

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Latitude and longitude required." });
        }

        const { data: loc, error } = await supabase
            .from("technician_locations")
            .insert([{
                technician_id: tech.technician_id,
                latitude,
                longitude,
                updated_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        res.json({
            success: true,
            data: loc
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Update Job Status Workflow
export const jobStatus = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id: bookingId } = req.params;
        let { status } = req.body;

        const tech = await getTechnicianRecord(userId);

        const { data: booking, error: bErr } = await supabase
            .from("bookings")
            .select("*")
            .eq("booking_id", bookingId)
            .single();

        if (bErr || !booking) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        if (status === "Completed" || status === "Finished" || status === "Work Completed") {
            status = "Waiting for Customer Confirmation";
        }

        const { data: updatedBooking, error: uErr } = await supabase
            .from("bookings")
            .update({
                booking_status: status,
                technician_completed_flag: status === "Waiting for Customer Confirmation",
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (uErr) throw uErr;

        if (booking.customer_id) {
            await createNotification({
                recipientRole: 'CUSTOMER',
                userId: booking.customer_id,
                bookingId,
                title: status === "Waiting for Customer Confirmation" ? "Work Finished — Confirmation Required" : `Status Update: ${status}`,
                description: status === "Waiting for Customer Confirmation" 
                    ? `Technician finished work on Booking #${bookingId}. Please review and confirm completion.`
                    : `Your booking #${bookingId} is now '${status}'.`,
                notificationType: 'Booking',
                priority: status === "Waiting for Customer Confirmation" ? "High" : "Medium"
            });
        }

        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId,
            title: `Technician Status: ${status}`,
            description: `Tech #${tech.technician_id} updated Booking #${bookingId} to '${status}'.`,
            notificationType: 'Booking',
            priority: 'Low'
        });

        res.json({
            success: true,
            data: updatedBooking,
            booking: updatedBooking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Accept Normal Job
export const accept = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id: bookingId } = req.params;
        const tech = await getTechnicianRecord(userId);

        const { data: updatedBooking, error } = await supabase
            .from("bookings")
            .update({
                technician_id: tech.technician_id,
                booking_status: "Accepted",
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) return res.status(404).json({ success: false, message: "Job not found" });

        await supabase
            .from("technicians")
            .update({ availability_status: "Busy" })
            .eq("technician_id", tech.technician_id);

        if (updatedBooking.customer_id) {
            await createNotification({
                recipientRole: 'CUSTOMER',
                userId: updatedBooking.customer_id,
                bookingId,
                title: 'Technician Accepted Job',
                description: `Technician ${tech.users?.full_name || ''} accepted your booking #${bookingId}.`,
                notificationType: 'Assignment'
            });
        }

        res.json({
            success: true,
            data: updatedBooking,
            booking: updatedBooking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Reject Job
export const reject = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id: bookingId } = req.params;
        const tech = await getTechnicianRecord(userId);

        const { data: updatedBooking, error } = await supabase
            .from("bookings")
            .update({
                technician_id: null,
                booking_status: "Pending",
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) return res.status(404).json({ success: false, message: "Job not found" });

        await supabase
            .from("technicians")
            .update({ availability_status: "Available" })
            .eq("technician_id", tech.technician_id);

        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId,
            title: 'Job Rejected by Technician',
            description: `Tech #${tech.technician_id} rejected Booking #${bookingId}. Reassignment required.`,
            notificationType: 'Assignment',
            priority: 'High'
        });

        res.json({
            success: true,
            data: updatedBooking,
            booking: updatedBooking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Broadcast Emergency Jobs
export const emergency = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        const { data: emergencyList, error } = await supabase
            .from("bookings")
            .select(`
                *,
                service_categories(category_name),
                service_problems(problem_name),
                users!customer_id(full_name, phone, address)
            `)
            .eq("category_id", tech.category_id)
            .eq("emergency_flag", true)
            .in("booking_status", ["Pending", "Assigned"])
            .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedEmergency = (emergencyList || []).map(e => ({
            ...e,
            id: e.booking_id,
            title: e.service_problems?.problem_name || e.issue_description || "Emergency Service",
            severity: "CRITICAL",
            service_address: `${e.street || ''} ${e.area || ''}, ${e.city || 'Mangalore'}`.trim()
        }));

        res.json({
            success: true,
            data: formattedEmergency.length > 0 ? formattedEmergency : null
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Accept Emergency Job
export const acceptEmergency = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { id: bookingId } = req.params;
        const tech = await getTechnicianRecord(userId);

        const { data: booking, error: bErr } = await supabase
            .from("bookings")
            .select("*")
            .eq("booking_id", bookingId)
            .single();

        if (bErr || !booking) {
            return res.status(404).json({ success: false, message: "Emergency Job not found" });
        }

        if (booking.technician_id && booking.technician_id !== tech.technician_id) {
            return res.status(400).json({
                success: false,
                message: "Emergency job has already been accepted by another technician."
            });
        }

        const { data: updatedBooking, error: uErr } = await supabase
            .from("bookings")
            .update({
                technician_id: tech.technician_id,
                booking_status: "Accepted",
                updated_at: new Date().toISOString()
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (uErr) throw uErr;

        await supabase
            .from("technicians")
            .update({ availability_status: "Busy" })
            .eq("technician_id", tech.technician_id);

        if (booking.customer_id) {
            await createNotification({
                recipientRole: 'CUSTOMER',
                userId: booking.customer_id,
                bookingId,
                title: '🚨 Emergency Technician Assigned',
                description: `Emergency job #${bookingId} accepted by Tech ${tech.users?.full_name || ''}.`,
                notificationType: 'Emergency',
                priority: 'High'
            });
        }

        await createNotification({
            recipientRole: 'DISPATCHER',
            bookingId,
            title: 'Emergency Job Claimed',
            description: `Tech #${tech.technician_id} claimed Emergency Booking #${bookingId}.`,
            notificationType: 'Emergency',
            priority: 'Medium'
        });

        res.json({
            success: true,
            data: updatedBooking,
            booking: updatedBooking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET Technician Notifications
export const notifications = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const tech = await getTechnicianRecord(userId);

        const { data: list, error } = await supabase
            .from("notifications")
            .select("*")
            .or(`recipient_role.eq.TECHNICIAN,recipient_role.eq.ALL,user_id.eq.${userId}`)
            .order("created_at", { ascending: false });

        if (error) throw error;

        const formattedNotifs = (list || []).map(n => ({
            ...n,
            id: n.notification_id,
            title: n.title,
            description: n.message,
            read: n.is_read,
            time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        res.json({
            success: true,
            data: formattedNotifs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH Mark Notification Read
export const notificationRead = async (req, res) => {
    try {
        const { id: notificationId } = req.params;

        const { data: updated, error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("notification_id", notificationId)
            .select()
            .single();

        if (error) return res.status(404).json({ success: false, message: "Notification not found" });

        res.json({
            success: true,
            data: updated
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export default {
    profile,
    dashboard,
    jobs,
    jobDetails,
    timeline,
    availability,
    location,
    jobStatus,
    accept,
    reject,
    emergency,
    acceptEmergency,
    notifications,
    notificationRead
};