"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchApi } from "@/app/utils/api";

const AppContext = createContext(null);

export function AppStore({ children }) {
  const [bookings, setBookings] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [cancelledBookings, setCancelledBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [adminNotifs, setAdminNotifs] = useState([]);
  const [dispNotifs, setDispNotifs] = useState([]);
  const [customerNotifs, setCustomerNotifs] = useState([]);
  const [kpiStats, setKpiStats] = useState({});
  const [dispatcherStats, setDispatcherStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch live backend data
  const refreshAllData = useCallback(async () => {
    try {
      // 1. Dispatcher dashboard data
      const dispRes = await fetchApi('/dispatcher/dashboard-stats').catch(() => null);
      if (dispRes?.stats || dispRes?.technicians) {
        const rawIntake = dispRes.intakeStream || [];
        const formattedBookings = rawIntake.map(b => ({
          ...b,
          id: b.booking_id,
          customer: b.users?.full_name || "Customer",
          phone: b.users?.phone || "N/A",
          category: b.service_categories?.category_name || "General Service",
          issue: b.issue_description || b.service_problems?.problem_name || "Field Repair",
          status: b.booking_status,
          priority: b.priority || (b.emergency_flag ? "High" : "Normal"),
          emergency: !!b.emergency_flag,
          address: `${b.street || ''} ${b.area || ''}, ${b.city || 'Mangalore'}`.trim(),
          technicianId: b.technician_id,
          technicianName: b.technicians?.users?.full_name || null,
          technicianPhone: b.technicians?.users?.phone || null,
          technicianRating: b.technicians?.rating || 5.0,
          createdAt: b.created_at,
          scheduledAt: b.preferred_date || b.created_at
        }));

        const formattedEmergencies = (dispRes.emergencyBroadcasts || []).map(e => ({
          ...e,
          id: e.booking_id,
          customer: e.users?.full_name || "Customer",
          phone: e.users?.phone || "N/A",
          category: e.service_categories?.category_name || "General Service",
          issue: e.emergency_reason || e.issue_description || "Emergency Priority Request",
          status: e.booking_status,
          priority: "Emergency",
          emergency: true,
          address: `${e.street || ''} ${e.area || ''}, ${e.city || 'Mangalore'}`.trim(),
          createdAt: e.created_at
        }));

        const formattedTechs = (dispRes.technicians || []).map(t => ({
          ...t,
          id: `TECH-${t.technician_id}`,
          technician_id: t.technician_id,
          name: t.users?.full_name || "Field Tech Specialist",
          email: t.users?.email || "N/A",
          phone: t.users?.phone || "N/A",
          category: t.service_categories?.category_name || "General",
          availability: t.availability_status || "Available",
          avgRating: t.rating || 5.0,
          avgResponseTime: "15 mins",
          completedJobs: 12,
          delayedJobs: 0
        }));

        setBookings(formattedBookings);
        setEmergencies(formattedEmergencies);
        setTechnicians(formattedTechs);
        setDispatcherStats(dispRes.stats || {});
      }

      // 2. Admin stats
      const adminRes = await fetchApi('/admin/stats').catch(() => null);
      if (adminRes?.stats) {
        setKpiStats(adminRes.stats);
      }

      // 3. Notifications
      const notifRes = await fetchApi('/notifications').catch(() => null);
      if (notifRes?.notifications) {
        setDispNotifs(notifRes.notifications.map(n => ({
          id: n.notification_id,
          title: n.title,
          description: n.message,
          read: n.is_read,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
        setAdminNotifs(notifRes.notifications.map(n => ({
          id: n.notification_id,
          title: n.title,
          description: n.message,
          read: n.is_read,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      }
    } catch (err) {
      console.error("AppStore sync error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
    const interval = setInterval(refreshAllData, 6000);
    return () => clearInterval(interval);
  }, [refreshAllData]);

  const assignTechnician = useCallback(async (bookingId, tech) => {
    try {
      const rawId = typeof tech === 'object' ? (tech.technician_id || tech.id) : tech;
      const cleanTechId = Number(String(rawId).replace(/\D/g, '')) || rawId;

      await fetchApi('/dispatcher/assign', {
        method: 'PATCH',
        body: JSON.stringify({
          bookingId: Number(bookingId),
          technicianId: cleanTechId
        })
      });
      refreshAllData();
    } catch (err) {
      alert("Failed to assign technician: " + err.message);
    }
  }, [refreshAllData]);

  const createBooking = useCallback(async (newBooking) => {
    try {
      const res = await fetchApi('/dispatcher/manual-booking', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: newBooking.customerName || newBooking.customer,
          customer_email: newBooking.customerEmail || 'walkin@fieldflow.com',
          customer_phone: newBooking.customerPhone || newBooking.phone,
          category_id: newBooking.categoryId || 1,
          problem_id: newBooking.problemId || null,
          issue_description: newBooking.issue || newBooking.description,
          emergency_flag: !!newBooking.emergency,
          street: newBooking.address || 'Walk-in Address',
          area: newBooking.area || 'Downtown',
          city: 'Mangalore'
        })
      });
      refreshAllData();
      return res.booking;
    } catch (err) {
      alert("Failed to create manual booking: " + err.message);
    }
  }, [refreshAllData]);

  const getLiveStats = useCallback(() => {
    const pending = bookings.filter(b => b.status === 'Pending').length;
    const availTechs = technicians.filter(t => t.availability === 'Available').length;
    const busyTechs = technicians.filter(t => t.availability === 'Busy').length;

    return {
      kpi: {
        totalBookingsToday: kpiStats.totalBookings || bookings.length,
        pendingBookings: pending,
        inProgressJobs: bookings.filter(b => b.status === 'Working' || b.status === 'On The Way' || b.status === 'Assigned').length,
        completedJobs: kpiStats.completedBookings || bookings.filter(b => b.status === 'Completed').length,
        cancelledJobs: cancelledBookings.length,
        activeTechnicians: kpiStats.activeTechnicians || (availTechs + busyTechs),
        expectedRevenueToday: kpiStats.totalRevenue || 12500,
        expectedRevenueWeek: 85000,
        expectedRevenueMonth: 340000,
        avgBookingValue: 450,
        monthlyGrowth: 12
      },
      dispatcher: {
        pendingBookings: pending || dispatcherStats.pendingBookings || 0,
        availableTechnicians: availTechs,
        busyTechnicians: busyTechs,
        emergencyJobs: emergencies.length,
        cancelledToday: cancelledBookings.length
      },
      charts: {
        weeklyBookingTrend: [
          { day: "Mon", bookings: 12 },
          { day: "Tue", bookings: 18 },
          { day: "Wed", bookings: 15 },
          { day: "Thu", bookings: 22 },
          { day: "Fri", bookings: 28 },
          { day: "Sat", bookings: 35 },
          { day: "Sun", bookings: 20 },
        ],
        bookingStatusDistribution: [
          { name: "Completed", value: kpiStats.completedBookings || 10, color: "#22C55E" },
          { name: "Pending", value: pending || 5, color: "#EAB308" },
          { name: "Emergency", value: emergencies.length || 2, color: "#EF4444" },
        ],
        monthlyRevenueTrend: [
          { month: "Jan", revenue: 150000, bookings: 45 },
          { month: "Feb", revenue: 180000, bookings: 52 },
          { month: "Mar", revenue: 210000, bookings: 60 },
          { month: "Apr", revenue: 250000, bookings: 75 },
        ],
        technicianWorkload: technicians.slice(0, 6).map(t => ({
          name: t.name ? t.name.split(" ")[0] : "Tech",
          jobs: 3,
          completed: 2
        }))
      }
    };
  }, [bookings, emergencies, cancelledBookings, technicians, kpiStats, dispatcherStats]);

  return (
    <AppContext.Provider value={{
      bookings, emergencies, cancelledBookings, technicians,
      adminNotifs, dispNotifs, customerNotifs,
      setAdminNotifs, setDispNotifs, setCustomerNotifs,
      getLiveStats, assignTechnician, createBooking, refreshAllData
    }}>
      {children}
    </AppContext.Provider>
  );
}

const defaultContextValue = {
  bookings: [],
  emergencies: [],
  cancelledBookings: [],
  technicians: [],
  adminNotifs: [],
  dispNotifs: [],
  customerNotifs: [],
  setAdminNotifs: () => {},
  setDispNotifs: () => {},
  setCustomerNotifs: () => {},
  getLiveStats: () => ({
    kpi: { totalBookingsToday: 0, pendingBookings: 0, completedJobs: 0, activeTechnicians: 0 },
    dispatcher: { pendingBookings: 0, availableTechnicians: 0, busyTechnicians: 0, emergencyJobs: 0, cancelledToday: 0 },
    charts: { weeklyBookingTrend: [], bookingStatusDistribution: [], technicianWorkload: [] }
  }),
  assignTechnician: () => {},
  createBooking: () => ({}),
  refreshAllData: () => {}
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    return defaultContextValue;
  }
  return ctx;
};
