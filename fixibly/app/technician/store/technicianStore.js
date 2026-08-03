"use client";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const normalizeAvailabilityOption = (value) => {
  const normalized = `${value || ""}`.trim().toLowerCase();
  if (["busy", "working", "on the way"].includes(normalized)) return "busy";
  if (["closed", "offline", "unavailable", "not available"].includes(normalized)) return "offline";
  return "available";
};

const normalizeAvailabilityValue = (value) => {
  switch (normalizeAvailabilityOption(value)) {
    case "busy": return "Busy";
    case "offline": return "Offline";
    default: return "Available";
  }
};

const normalizeJobStatus = (value) => {
  const normalized = `${value || ""}`.trim().toLowerCase();
  if (!normalized) return "pending";
  if (["accepted", "assigned", "dispatched"].includes(normalized)) return "accepted";
  if (["on_the_way", "on the way", "en route", "en_route"].includes(normalized)) return "on_the_way";
  if (["arrived"].includes(normalized)) return "arrived";
  if (["working", "in progress", "in_progress"].includes(normalized)) return "working";
  if (["completed", "done", "finished"].includes(normalized)) return "completed";
  if (["rejected", "cancelled", "canceled", "declined"].includes(normalized)) return "cancelled";
  return normalized.replace(/\s+/g, "_");
};

const formatJobStatus = (value) => {
  const normalized = normalizeJobStatus(value);
  if (normalized === "on_the_way") return "On the Way";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/_/g, " ");
};

const normalizeProfile = (profile) => ({
  ...profile,
  full_name: profile?.user?.full_name || profile?.full_name || "—",
  email: profile?.user?.email || profile?.email || "—",
  phone: profile?.user?.phone || profile?.phone || "—",
  address: profile?.user?.address || profile?.address || "—",
  service_category: profile?.category?.category_name || profile?.service_category || profile?.role || "Field Technician",
  experience_years: profile?.experience_years ?? profile?.experience ?? 0,
  rating: profile?.rating ?? 0,
  availability_status: profile?.availability_status || profile?.availability || "Offline",
  availability: normalizeAvailabilityOption(profile?.availability_status || profile?.availability || "Offline"),
  profile_picture: profile?.profile_picture || profile?.user?.profile_picture || null,
});

const normalizeJob = (job) => {
  const normalizedStatus = normalizeJobStatus(job?.booking_status || job?.status || job?.state);
  const title = job?.title || job?.service_type || job?.category?.category_name || "Service Job";
  return {
    ...job,
    id: job?.booking_id || job?.id,
    booking_id: job?.booking_id || job?.id,
    title,
    customer_name: job?.customer?.full_name || job?.customer_name || job?.customer || "—",
    customer_phone: job?.customer?.phone || job?.customer_phone || job?.phone || "—",
    service_address: job?.service_address || job?.address || "—",
    schedule_time: job?.schedule_time || job?.scheduled_at || job?.created_at || null,
    description: job?.description || job?.problem_description || job?.problem?.problem_name || "No description provided.",
    category: job?.category?.category_name || job?.category || job?.service_type || "—",
    priority: job?.priority || "Standard",
    status: normalizedStatus,
    display_status: formatJobStatus(normalizedStatus),
    customer_approved_completion: Boolean(job?.customer_completed_flag || job?.customer_approved_completion),
  };
};

const normalizeNotification = (notification) => ({
  ...notification,
  id: notification?.notification_id || notification?.id,
  title: notification?.title || notification?.message || "Notification",
  body: notification?.body || notification?.description || "",
  is_read: Boolean(notification?.is_read ?? notification?.read),
  created_at: notification?.created_at || notification?.timestamp || null,
});

// Helper: GET with auth token
const apiFetch = async (path, token) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json.data;
};

// Helper: PUT/PATCH with auth token
const apiMutate = async (path, method, body, token) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json.data;
};

const useTechnicianStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  token: null,
  technician: null,
  stats: null,
  assignedJobs: [],
  emergencyJob: null,
  timeline: [],
  notifications: [],
  unreadCount: 0,
  selectedJob: null,
  availability: "available",
  loading: false,
  error: null,

  // ── Auth ───────────────────────────────────────────────────────────────────
  setToken: (token) => set({ token }),
  setTechnician: (technician) => set({ technician }),

  // ── UI helpers ─────────────────────────────────────────────────────────────
  setSelectedJob: (job) => set({ selectedJob: job }),
  setAvailability: (status) => set({ availability: status }),

  // ── Fetch all dashboard data ───────────────────────────────────────────────
  fetchAll: async () => {
    const { token } = get();
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const [profile, jobs, emergencyList, notifications] = await Promise.all([
        apiFetch("/technician/profile", token),
        apiFetch("/technician/jobs", token),
        apiFetch("/technician/emergency", token),
        apiFetch("/technician/notifications", token),
      ]);

      const normalizedProfile = normalizeProfile(profile);
      const normalizedJobs = Array.isArray(jobs) ? jobs.map(normalizeJob) : [];
      const normalizedEmergencyJobs = Array.isArray(emergencyList) ? emergencyList.map(normalizeJob) : [];
      const normalizedNotifications = Array.isArray(notifications) ? notifications.map(normalizeNotification) : [];

      const activeJobsList = normalizedJobs.filter((job) => !["completed", "cancelled"].includes(job.status));
      const completedToday = normalizedJobs.filter((job) => job.status === "completed").length;

      const computedTimeline = normalizedJobs
        .filter((job) => job.schedule_time || job.created_at)
        .slice(0, 4)
        .map((job) => ({
          time: job.schedule_time
            ? new Date(job.schedule_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "ASAP",
          task: job.title || "Service Call",
        }));

      set({
        technician: normalizedProfile,
        stats: {
          activeJobs: activeJobsList.length,
          completedToday,
          emergencyRequests: normalizedEmergencyJobs.length,
        },
        assignedJobs: normalizedJobs,
        emergencyJob: normalizedEmergencyJobs[0] || null,
        timeline: computedTimeline,
        notifications: normalizedNotifications,
        unreadCount: normalizedNotifications.filter((notification) => !notification.is_read).length,
        availability: normalizeAvailabilityOption(normalizedProfile?.availability_status || normalizedProfile?.availability || "Available"),
        loading: false,
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  // ── Fetch notifications only (for polling) ─────────────────────────────────
  fetchNotifications: async () => {
    const { token } = get();
    if (!token) return;
    try {
      const data = await apiFetch("/technician/notifications", token);
      const normalizedNotifications = Array.isArray(data) ? data.map(normalizeNotification) : [];
      set({
        notifications: normalizedNotifications,
        unreadCount: normalizedNotifications.filter((notification) => !notification.is_read).length,
      });
    } catch (_) {}
  },

  // ── Mark notifications read ────────────────────────────────────────────────
  markNotificationsRead: async (notificationId) => {
    const { token, notifications } = get();
    if (!token) return;
    try {
      const targets = notificationId
        ? notifications.filter((notification) => notification.id === notificationId)
        : notifications.filter((notification) => !notification.is_read);

      if (targets.length > 0) {
        await Promise.all(targets.map((notification) => apiMutate(`/technician/notifications/${notification.id}/read`, "PUT", null, token)));
      }

      set((state) => ({
        notifications: state.notifications.map((notification) => ({ ...notification, is_read: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  // ── Update Availability ──────────────────────────────────────────────────
  updateAvailability: async (status) => {
    const { token } = get();
    if (!token) return;
    try {
      const backendStatus = normalizeAvailabilityValue(status);
      await apiMutate("/technician/availability", "PUT", { status: backendStatus }, token);
      set({ availability: normalizeAvailabilityOption(backendStatus) });
    } catch (err) {
      console.error("Failed to update availability", err);
    }
  },

  // ── Update Location ──────────────────────────────────────────────────────
  updateLocation: async (latitude, longitude) => {
    const { token } = get();
    if (!token) return;
    try {
      await apiMutate("/technician/location", "PUT", { latitude, longitude }, token);
    } catch (err) {
      console.error("Failed to update location", err);
    }
  },

  // ── Job Actions ────────────────────────────────────────────────────────────
  acceptJob: async (jobId) => {
    const { token, fetchAll } = get();
    if (!token) return;
    try {
      await apiMutate(`/technician/jobs/${jobId}/accept`, "PUT", null, token);
      await fetchAll();
    } catch (err) {
      throw new Error(err.message || "Accept failed");
    }
  },

  rejectJob: async (jobId) => {
    const { token, fetchAll } = get();
    if (!token) return;
    try {
      await apiMutate(`/technician/jobs/${jobId}/reject`, "PUT", null, token);
      await fetchAll();
    } catch (err) {
      throw new Error(err.message || "Reject failed");
    }
  },

  updateJobStatus: async (jobId, status) => {
    const { token, fetchAll } = get();
    if (!token) return;
    try {
      await apiMutate(`/technician/jobs/${jobId}/status`, "PUT", { status }, token);
      await fetchAll();
    } catch (err) {
      throw new Error(err.message || "Update status failed");
    }
  },

  completeJob: async (jobId) => {
    const { token, fetchAll } = get();
    if (!token) return;
    try {
      await apiMutate(`/technician/jobs/${jobId}/complete`, "PUT", null, token);
      await fetchAll();
    } catch (err) {
      throw new Error(err.message || "Complete failed. Ensure customer has approved.");
    }
  },

  // ── Emergency Actions ──────────────────────────────────────────────────────
  acceptEmergencyJob: async (jobId) => {
    const { token, fetchAll } = get();
    if (!token) return;
    try {
      await apiMutate(`/technician/emergency/${jobId}/accept`, "PUT", null, token);
      await fetchAll();
    } catch (err) {
      throw new Error(err.message || "Accept emergency failed");
    }
  },
}));

export default useTechnicianStore;
