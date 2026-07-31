"use client";
import { create } from "zustand";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper: GET with auth token
const apiFetch = async (path, token) => {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "API error");
  return json.data;
};

const useTechnicianStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────────
  token:         null,
  technician:    null,
  stats:         null,
  assignedJobs:  [],
  emergencyJob:  null,   // null = no active emergency
  timeline:      [],
  notifications: [],
  unreadCount:   0,
  selectedJob:   null,
  availability:  "available",
  loading:       false,
  error:         null,

  // ── Auth ───────────────────────────────────────────────────────────────────
  setToken: (token) => set({ token }),

  // ── UI helpers ─────────────────────────────────────────────────────────────
  setSelectedJob:  (job)    => set({ selectedJob: job }),
  setAvailability: (status) => set({ availability: status }),

  // ── Fetch all dashboard data ───────────────────────────────────────────────
  fetchAll: async () => {
    const { token } = get();
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const [profile, dashboard, jobs, emergency, timeline, notifications] =
        await Promise.all([
          apiFetch("/technician/profile",       token),
          apiFetch("/technician/dashboard",     token),
          apiFetch("/technician/jobs",          token),
          apiFetch("/technician/emergency",     token),
          apiFetch("/technician/timeline",      token),
          apiFetch("/technician/notifications", token),
        ]);

      set({
        technician:    profile,
        stats: {
          activeJobs:         parseInt(dashboard.active_jobs)    || 0,
          completedToday:     parseInt(dashboard.completed_today) || 0,
          emergencyRequests:  parseInt(dashboard.emergency_count) || 0,
        },
        assignedJobs:  Array.isArray(jobs) ? jobs : [],
        emergencyJob:  emergency || null,   // null when no active emergency
        timeline:      Array.isArray(timeline) ? timeline : [],
        notifications: Array.isArray(notifications) ? notifications : [],
        unreadCount:   Array.isArray(notifications)
                         ? notifications.filter((n) => !n.is_read).length
                         : 0,
        availability:  profile?.availability || "available",
        loading:       false,
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
      set({
        notifications: Array.isArray(data) ? data : [],
        unreadCount:   Array.isArray(data) ? data.filter((n) => !n.is_read).length : 0,
      });
    } catch (_) {}
  },

  // ── Mark notifications read ────────────────────────────────────────────────
  markNotificationsRead: async (notificationId) => {
    const { token } = get();
    if (!token) return;
    await fetch(`${API}/technician/notifications/read`, {
      method:  "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify(notificationId ? { notification_id: notificationId } : {}),
    });
    set((state) => ({
      notifications: state.notifications.map((n) =>
        notificationId ? (n.id === notificationId ? { ...n, is_read: true } : n) : { ...n, is_read: true }
      ),
      unreadCount: 0,
    }));
  },

  // ── Cancel a job ───────────────────────────────────────────────────────────
  cancelJob: async (jobId, reason) => {
    const { token } = get();
    const res = await fetch(`${API}/technician/jobs/${jobId}/cancel`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Cancel failed");
    // Remove cancelled job from local list
    set((state) => ({
      assignedJobs: state.assignedJobs.filter((j) => j.id !== jobId),
    }));
    return json;
  },
}));

export default useTechnicianStore;
