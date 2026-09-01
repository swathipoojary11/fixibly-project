"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AdminContext = createContext(null);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const toBool = (value) => Boolean(value);

const safeFetchJson = async (url, options) => {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            return { success: false, status: res.status };
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            return { success: false, message: "Response is not JSON" };
        }
        return await res.json();
    } catch (err) {
        return { success: false, error: err.message };
    }
};

export function AdminStoreProvider({ children }) {
    const [liveStats, setLiveStats] = useState(null);
    const [adminNotifs, setAdminNotifs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [emergencies, setEmergencies] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dispatchers, setDispatchers] = useState([]);
    const [userCounts, setUserCounts] = useState({ total: 0, customers: 0, technicians: 0, dispatchers: 0 });
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const [analyticsRes, overviewRes, notifsRes, reportsRes, usersRes] = await Promise.all([
                    safeFetchJson(`${API}/admin/dashboard-analytics`),
                    safeFetchJson(`${API}/admin/overview`),
                    safeFetchJson(`${API}/notifications?role=ADMIN`),
                    safeFetchJson(`${API}/admin/reports`),
                    safeFetchJson(`${API}/admin/users`)
                ]);

                // ── Users ──────────────────────────────────────────────
                if (usersRes?.success) {
                    const counts = usersRes.counts || { total: 0, customers: 0, technicians: 0, dispatchers: 0 };
                    setUserCounts({
                        total: Number(counts.total || 0),
                        customers: Number(counts.customers || 0),
                        technicians: Number(counts.technicians || 0),
                        dispatchers: Number(counts.dispatchers || 0)
                    });
                    setCustomers((usersRes.customers || []).map(u => ({
                        ...u,
                        id: u.user_id,
                        name: u.full_name,
                        role: "Customer",
                        status: "Active",
                        joinedDate: u.created_at,
                        verified: true,
                        lastLogin: "—"
                    })));
                    setDispatchers((usersRes.dispatchers || []).map(u => ({
                        ...u,
                        id: u.user_id,
                        name: u.full_name,
                        role: "Dispatcher",
                        status: "Active",
                        joinedDate: u.created_at,
                        verified: true,
                        lastLogin: "—"
                    })));
                }

                // ── Overview (bookings, technicians, audit logs) ───────
                if (overviewRes?.success) {
                    const mapBooking = b => ({
                        id: b.booking_id,
                        customer: b.customers?.full_name || b.customer_name || `Customer ${b.customer_id || ""}`.trim(),
                        phone: b.customers?.phone || "",
                        category: b.category_id === 1 ? "Plumbing" : b.category_id === 2 ? "Electrical" : b.category_id === 3 ? "HVAC" : b.category_id === 4 ? "House Cleaning" : b.category_id === 5 ? "Exterior Cleaning" : b.category_id === 6 ? "Handyman" : b.category_id === 7 ? "Landscaping" : b.category_id === 8 ? "Pest Control" : b.category_id === 9 ? "Home Remodeling" : b.category_id === 10 ? "Painting & Decoration" : (b.category || "General"),
                        status: b.booking_status || "Pending",
                        priority: b.priority || "Normal",
                        emergency: toBool(b.emergency_flag),
                        address: [b.house_number, b.street, b.area, b.city].filter(Boolean).join(", "),
                        technicianId: b.technician_id || null,
                        technicianName: b.technician_name || b.technicians?.users?.full_name || null,
                        createdAt: b.created_at,
                        scheduledAt: b.preferred_date || b.created_at,
                        issue: b.issue || b.service_problems?.problem_name || b.service_problems?.[0]?.problem_name || b.issue_description || ""
                    });

                    const rawBookings = overviewRes.bookings || [];
                    const allMapped = rawBookings.map(mapBooking);
                    setBookings(allMapped.filter(b => !b.emergency));
                    setEmergencies(allMapped.filter(b => b.emergency));

                    setTechnicians((overviewRes.technicians || []).map(t => {
                        const techId = t.technician_id;
                        const mine = rawBookings.filter(b => b.technician_id === techId);
                        const completedJobs = mine.filter(b => b.booking_status === 'Completed').length;
                        const assignedJobs  = mine.filter(b => b.booking_status !== 'Pending' && b.booking_status !== 'Cancelled').length;
                        const delayedJobs   = mine.filter(b => b.booking_status === 'Delayed').length;
                        const total = mine.length;
                        return {
                            id: techId,
                            name: t.users?.full_name || `Tech ${techId}`,
                            email: t.users?.email || "",
                            phone: t.users?.phone || "",
                            availability: t.availability_status || "Available",
                            category: t.category_id === 1 ? "Plumbing" : t.category_id === 2 ? "Electrical" : t.category_id === 3 ? "HVAC" : t.category_id === 4 ? "House Cleaning" : t.category_id === 5 ? "Exterior Cleaning" : t.category_id === 6 ? "Handyman" : t.category_id === 7 ? "Landscaping" : t.category_id === 8 ? "Pest Control" : t.category_id === 9 ? "Home Remodeling" : t.category_id === 10 ? "Painting & Decoration" : "General",
                            avgRating: Number(t.rating) || 0,
                            completionRate: total > 0 ? Math.round((completedJobs / total) * 100) : 0,
                            assignedJobs,
                            completedJobs,
                            delayedJobs,
                            joinedDate: t.users?.created_at || new Date().toISOString(),
                            verified: true,
                            status: "Active",
                            role: "Technician"
                        };
                    }));

                    if (overviewRes.auditLogs) {
                        setActivityLogs(overviewRes.auditLogs.map((l, idx) => ({
                            id: l.log_id || l.activity_id || idx,
                            action: l.activity_type || "System Event",
                            description: l.activity_description || "",
                            actor: l.role || "System",
                            date: l.created_at,
                            timestamp: l.created_at
                        })));
                    }
                }

                // ── Analytics (KPIs + charts) ──────────────────────────
                if (analyticsRes?.success) {
                    const km = analyticsRes.keyMetrics || {};
                    const ch = analyticsRes.charts || {};
                    const rp = reportsRes?.reports || {};

                    const avgBookingVal = rp.monthly?.successfulPaymentsCount
                        ? Math.round(rp.monthly.revenue / rp.monthly.successfulPaymentsCount)
                        : 0;

                    setLiveStats({
                        kpi: {
                            totalBookingsToday: km.totalBookingsToday?.value || 0,
                            pendingBookings: km.pendingBookings?.value || 0,
                            inProgressJobs: km.inProgressJobs?.value || 0,
                            completedJobs: km.completedJobs?.value || 0,
                            cancelledJobs: km.cancelledJobs?.value || 0,
                            lateJobs: km.lateJobs?.value || 0,
                            emergencyBookings: km.emergencyBookings?.value || 0,
                            activeTechnicians: km.activeTechnicians?.value || 0,
                            expectedRevenueToday: km.expectedRevenueToday?.value || 0,
                            expectedRevenueWeek: rp.weekly?.revenue || 0,
                            expectedRevenueMonth: rp.monthly?.revenue || 0,
                            avgBookingValue: avgBookingVal,
                            monthlyGrowth: 0
                        },
                        charts: {
                            weeklyBookingTrend: ch.weeklyTrend || [],
                            bookingStatusDistribution: [
                                { name: "Completed",   value: ch.bookingStatusBreakdown?.completed  || 0, color: "#22C55E" },
                                { name: "In Progress", value: ch.bookingStatusBreakdown?.inProgress || 0, color: "#F97316" },
                                { name: "Pending",     value: ch.bookingStatusBreakdown?.pending    || 0, color: "#EAB308" },
                                { name: "Cancelled",   value: ch.bookingStatusBreakdown?.cancelled  || 0, color: "#EF4444" },
                                { name: "Delayed",     value: ch.bookingStatusBreakdown?.delayed    || 0, color: "#8B5CF6" }
                            ],
                            emergencyVsNormal: ch.emergencyVsNormal || [],
                            technicianWorkload: (ch.technicianWorkload || []).map(w => ({
                                name: w.name, jobs: w.assigned, completed: w.completed
                            })),
                            dailyBookingVolume: (ch.todaysBookingVolume || []).map(v => ({
                                hour: v.time, bookings: v.count
                            })),
                            monthlyRevenueTrend: ch.monthlyRevenueTrend || []
                        }
                    });
                }

                // ── Notifications ──────────────────────────────────────
                if (notifsRes?.success) {
                    setAdminNotifs((notifsRes.notifications || []).map(n => ({
                        ...n,
                        id: n.notification_id || n.id,
                        read: toBool(n.is_read),
                        category: (n.notification_type || "system").toLowerCase()
                    })));
                }
            } catch (err) {
                console.error("Failed to fetch admin data:", err);
                setFetchError(err.message || "Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getLiveStats = useCallback(() => {
        if (liveStats) return liveStats;
        return {
            kpi: {
                totalBookingsToday: 0, pendingBookings: 0, inProgressJobs: 0,
                completedJobs: 0, cancelledJobs: 0, lateJobs: 0, emergencyBookings: 0,
                activeTechnicians: 0, expectedRevenueToday: 0, expectedRevenueWeek: 0,
                expectedRevenueMonth: 0, avgBookingValue: 0, monthlyGrowth: 0
            },
            charts: {
                weeklyBookingTrend: [], bookingStatusDistribution: [],
                emergencyVsNormal: [], technicianWorkload: [],
                dailyBookingVolume: [], monthlyRevenueTrend: []
            }
        };
    }, [liveStats]);

    const markNotifsReadAsync = async () => {
        try {
            await fetch(`${API}/notifications/mark-read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "ADMIN" })
            });
            setAdminNotifs(n => n.map(x => ({ ...x, read: true, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    // Reports built from real booking data per period
    const kStats = getLiveStats().kpi;
    const cStats = getLiveStats().charts;
    const allBookings = [...bookings, ...emergencies];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const makeReport = (period, revenue, since) => {
        const periodBookings = since
            ? allBookings.filter(b => b.createdAt && new Date(b.createdAt) >= since)
            : allBookings;
        const total      = periodBookings.length;
        const completed  = periodBookings.filter(b => b.status === 'Completed').length;
        const cancelled  = periodBookings.filter(b => b.status === 'Cancelled').length;
        const emergency  = periodBookings.filter(b => b.emergency).length;
        return {
            period,
            totalBookings: total,
            completedJobs: completed,
            cancelledJobs: cancelled,
            emergencyJobs: emergency,
            expectedRevenue: revenue || 0,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            technicianPerformance: (cStats.technicianWorkload || []).map(t => ({
                name: t.name, completed: t.completed, rating: 5
            }))
        };
    };

    const reports = {
        daily:   makeReport('Today',      kStats.expectedRevenueToday,  startOfToday),
        weekly:  makeReport('This Week',  kStats.expectedRevenueWeek,   startOfWeek),
        monthly: makeReport('This Month', kStats.expectedRevenueMonth,  startOfMonth)
    };

    return (
        <AdminContext.Provider value={{
            bookings, emergencies, technicians,
            customers, dispatchers, userCounts,
            adminNotifs, setAdminNotifs, markNotifsReadAsync,
            getLiveStats, activityLogs, reports,
            loading, fetchError
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdminStore = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider");
    return ctx;
};
