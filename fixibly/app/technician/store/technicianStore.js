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
  availability:  "Available",
  loading:       false,
  error:         null,

  // ── Auth ───────────────────────────────────────────────────────────────────
  setToken: (token) => set({ token }),

  // ── UI helpers ─────────────────────────────────────────────────────────────
  setSelectedJob:  (job)    => set({ selectedJob: job }),
  setAvailability: async (status) => {
    set({ availability: status });
    const token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (token) {
      fetch(`${API}/technician/availability`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      }).catch(() => {});
    }
  },

  // ── Fetch all dashboard data ───────────────────────────────────────────────
  fetchAll: async () => {
    let token = get().token;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('token');
      if (token) set({ token });
    }
    if (!token) return;

    set({ loading: true, error: null });
    try {
      const [profile, dashboard, jobs, emergency, timeline, notifications] =
        await Promise.all([
          apiFetch("/technician/profile",       token).catch(() => null),
          apiFetch("/technician/dashboard",     token).catch(() => null),
          apiFetch("/technician/jobs",          token).catch(() => []),
          apiFetch("/technician/emergency",     token).catch(() => null),
          apiFetch("/technician/timeline",      token).catch(() => []),
          apiFetch("/technician/notifications", token).catch(() => []),
        ]);

      set({
        technician:    profile || null,
        stats: {
          activeJobs:         parseInt(dashboard?.active_jobs)    || (Array.isArray(jobs) ? jobs.length : 0),
          completedToday:     parseInt(dashboard?.completed_today) || 0,
          emergencyRequests:  parseInt(dashboard?.emergency_count) || (Array.isArray(emergency) ? emergency.length : 0),
        },
        assignedJobs:  Array.isArray(jobs) ? jobs : [],
        emergencyJob:  Array.isArray(emergency) ? emergency[0] : (emergency || null),
        timeline:      Array.isArray(timeline) ? timeline : [],
        notifications: Array.isArray(notifications) ? notifications : [],
        unreadCount:   Array.isArray(notifications)
                         ? notifications.filter((n) => !n.is_read && !n.read).length
                         : 0,
        availability:  profile?.availability || profile?.availability_status || "Available",
        loading:       false,
      });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },

  // ── Fetch notifications only (for polling) ─────────────────────────────────
  fetchNotifications: async () => {
    let token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!token) return;
    try {
      const data = await apiFetch("/technician/notifications", token);
      set({
        notifications: Array.isArray(data) ? data : [],
        unreadCount:   Array.isArray(data) ? data.filter((n) => !n.is_read && !n.read).length : 0,
      });
    } catch (_) {}
  },

  // ── Mark notifications read ────────────────────────────────────────────────
  markNotificationsRead: async (notificationId) => {
    let token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (!token) return;
    await fetch(`${API}/technician/notifications/read`, {
      method:  "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify(notificationId ? { notification_id: notificationId } : {}),
    });
    set((state) => ({
      notifications: state.notifications.map((n) =>
        notificationId ? (n.id === notificationId ? { ...n, is_read: true, read: true } : n) : { ...n, is_read: true, read: true }
      ),
      unreadCount: 0,
    }));
  },

  // ── Cancel / Reject a job ──────────────────────────────────────────────────
  cancelJob: async (jobId, reason) => {
    let token = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    const res = await fetch(`${API}/technician/jobs/${jobId}/reject`, {
      method:  "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Cancel failed");
    set((state) => ({
      assignedJobs: state.assignedJobs.filter((j) => (j.id !== jobId && j.booking_id !== jobId)),
    }));
    return json;
  },
}));

export default useTechnicianStore;
