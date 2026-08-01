"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { bookings as initBookings, emergencyBookings as initEM, cancelledBookings as initCancelled } from "../data/bookings";
import { technicians as initTechs } from "../data/technicians";
import {
  kpiStats, dispatcherStats,
  weeklyBookingTrend, bookingStatusDistribution,
  emergencyVsNormal, technicianWorkload,
  dailyBookingVolume, monthlyRevenueTrend,
} from "../data/analytics";

const AppContext = createContext(null);

export function AppStore({ children }) {
  const [bookings, setBookings] = useState(initBookings);
  const [emergencies, setEmergencies] = useState(initEM);
  const [cancelledBookings, setCancelledBookings] = useState(
    (Array.isArray(initCancelled) ? initCancelled : [])
      .filter(Boolean)
      .map((entry, index) => ({
        ...entry,
        id: entry.id ?? `CB-${index + 1}`,
        customer: entry.customer ?? "Unknown",
        cancelledBy: entry.cancelledBy ?? "Customer",
        needsReassign: entry.needsReassign ?? true,
        reassignedTo: entry.reassignedTo ?? null,
      }))
  );
  const [technicians, setTechnicians] = useState(initTechs);
  const [adminNotifs, setAdminNotifs] = useState([]);
  const [dispNotifs, setDispNotifs] = useState([]);
  // Customer notifications — auto-populated when technician updates status
  const [customerNotifs, setCustomerNotifs] = useState([]);

  const addDispNotif = useCallback((notif) => {
    setDispNotifs(prev => [{ ...notif, id: `DN-${Date.now()}`, read: false, time: "Just now" }, ...prev]);
  }, []);
  const addAdminNotif = useCallback((notif) => {
    setAdminNotifs(prev => [{ ...notif, id: `N-${Date.now()}`, read: false, time: "Just now" }, ...prev]);
  }, []);
  const addCustomerNotif = useCallback((notif) => {
    setCustomerNotifs(prev => [{ ...notif, id: `CN-${Date.now()}`, read: false, time: "Just now" }, ...prev]);
  }, []);

  const getLiveStats = useCallback(() => {
    const all = [...bookings, ...emergencies];
    const pending    = all.filter(b => b.status === "Pending").length;
    const inProgress = all.filter(b => b.status === "In Progress").length;
    const completed  = all.filter(b => b.status === "Completed").length;
    const cancelled  = all.filter(b => b.status === "Cancelled").length;
    const delayed    = all.filter(b => b.status === "Delayed").length;
    const availTechs = technicians.filter(t => t.availability === "Available").length;
    const busyTechs  = technicians.filter(t => t.availability === "Busy").length;
    return {
      kpi: {
        ...kpiStats,
        totalBookingsToday: all.length,
        pendingBookings: pending, inProgressJobs: inProgress,
        completedJobs: completed, cancelledJobs: cancelled,
        lateJobs: delayed, emergencyBookings: emergencies.length,
        activeTechnicians: availTechs + busyTechs,
      },
      dispatcher: {
        ...dispatcherStats,
        pendingBookings: pending, availableTechnicians: availTechs,
        busyTechnicians: busyTechs,
        emergencyJobs: emergencies.filter(e => e.status === "Pending").length,
        cancelledToday: cancelledBookings.length,
      },
      charts: {
        weeklyBookingTrend,
        bookingStatusDistribution: [
          { name: "Completed",   value: completed  || bookingStatusDistribution[0].value, color: "#22C55E" },
          { name: "In Progress", value: inProgress || bookingStatusDistribution[1].value, color: "#F97316" },
          { name: "Pending",     value: pending    || bookingStatusDistribution[2].value, color: "#EAB308" },
          { name: "Cancelled",   value: cancelled  || bookingStatusDistribution[3].value, color: "#EF4444" },
          { name: "Delayed",     value: delayed    || bookingStatusDistribution[4].value, color: "#8B5CF6" },
        ],
        emergencyVsNormal,
        technicianWorkload: technicians.slice(0, 6).map(t => ({
          name: t.name.split(" ")[0],
          jobs: t.assignedJobs,
          completed: t.completedJobs,
        })),
        dailyBookingVolume,
        monthlyRevenueTrend,
      },
    };
  }, [bookings, emergencies, cancelledBookings, technicians]);

  const assignTechnician = useCallback((bookingId, tech, isEmergency = false) => {
    const updater = b => b.id === bookingId
      ? { ...b, technicianId: tech.id, technicianName: tech.name, technicianPhone: tech.phone, technicianCategory: tech.category, technicianRating: tech.avgRating, status: "Assigned" }
      : b;
    if (isEmergency) setEmergencies(prev => prev.map(updater));
    else setBookings(prev => prev.map(updater));
    setTechnicians(prev => prev.map(t => t.id === tech.id ? { ...t, availability: "Busy", currentBooking: bookingId } : t));
    // Notify dispatcher
    addDispNotif({ type: "Technician Assigned", category: "accepted", title: "Technician Assigned", description: `${tech.name} assigned to ${bookingId}. Customer has been notified with technician details.`, icon: "accept" });
    // Notify customer automatically
    addCustomerNotif({ type: "Booking Confirmed", bookingId, title: "Technician Assigned to Your Booking", description: `${tech.name} (${tech.category}, ★${tech.avgRating}) has been assigned to your booking ${bookingId}. Phone: ${tech.phone}`, icon: "accept" });
    addAdminNotif({ type: "Booking Assigned", category: "booking", title: "Booking Assigned", description: `${bookingId} assigned to ${tech.name} by dispatcher.`, icon: "booking" });
  }, [addDispNotif, addAdminNotif, addCustomerNotif]);

  const technicianCancel = useCallback((bookingId, techName, techId, reason) => {
    let booking = bookings.find(b => b.id === bookingId) || emergencies.find(b => b.id === bookingId);
    setBookings(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: "Cancelled", cancelledBy: "Technician", cancelReason: reason, technicianId: null, technicianName: null }
      : b));
    setEmergencies(prev => prev.map(b => b.id === bookingId
      ? { ...b, status: "Cancelled", cancelledBy: "Technician", cancelReason: reason }
      : b));
    if (techId) setTechnicians(prev => prev.map(t => t.id === techId ? { ...t, availability: "Available", currentBooking: null } : t));
    setCancelledBookings(prev => [{
      id: bookingId, customer: booking?.customer || "Unknown", customerPhone: booking?.phone || "",
      address: booking?.address || "", category: booking?.category || "", issue: booking?.issue || "",
      scheduledAt: booking?.scheduledAt || "", technicianName: techName,
      cancelledAt: new Date().toISOString(), cancelledBy: "Technician", reason, needsReassign: true,
    }, ...prev]);
    addDispNotif({ type: "Booking Cancelled", category: "cancel", title: "Technician Cancelled — Reassign Needed", description: `${techName} cancelled ${bookingId}. Reason: ${reason}. Please reassign.`, icon: "cancel" });
    addCustomerNotif({ type: "Booking Cancelled", bookingId, title: "Your Booking Was Cancelled", description: `Technician ${techName} cancelled booking ${bookingId}. Reason: ${reason}. A new technician will be assigned shortly.`, icon: "cancel" });
    addAdminNotif({ type: "Cancelled Booking", category: "cancel", title: "Technician Cancelled", description: `${bookingId} cancelled by ${techName}. Reason: ${reason}.`, icon: "cancel" });
  }, [bookings, emergencies, addDispNotif, addAdminNotif, addCustomerNotif]);

  const reassignBooking = useCallback((cancelledBookingId, tech) => {
    setBookings(prev => prev.map(b => b.id === cancelledBookingId
      ? { ...b, status: "Assigned", technicianId: tech.id, technicianName: tech.name, technicianPhone: tech.phone, cancelledBy: null, cancelReason: null }
      : b));
    setTechnicians(prev => prev.map(t => t.id === tech.id ? { ...t, availability: "Busy", currentBooking: cancelledBookingId } : t));
    setCancelledBookings(prev => prev.map(b => b.id === cancelledBookingId ? { ...b, needsReassign: false, reassignedTo: tech.name } : b));
    addDispNotif({ type: "Booking Reassigned", category: "accepted", title: "Booking Reassigned", description: `${cancelledBookingId} reassigned to ${tech.name}.`, icon: "accept" });
    addCustomerNotif({ type: "Booking Reassigned", bookingId: cancelledBookingId, title: "New Technician Assigned", description: `${tech.name} has been assigned to your booking ${cancelledBookingId}. Phone: ${tech.phone}`, icon: "accept" });
  }, [addDispNotif, addCustomerNotif]);

  // Technician status update — auto-notifies BOTH dispatcher AND customer directly
  const updateTechnicianStatus = useCallback((bookingId, statusType, location = null) => {
    const statusMap = {
      accepted:  { bookingStatus: "Assigned",   dispTitle: "Technician Accepted Job",    custTitle: "Technician Accepted Your Booking",   custDesc: (b, t) => `${t} has accepted your booking ${b} and will start shortly.` },
      started:   { bookingStatus: "In Progress", dispTitle: "Technician Started Journey", custTitle: "Technician Is On The Way",            custDesc: (b, t) => `${t} has started the journey to your location for booking ${b}.` },
      ontheway:  { bookingStatus: "On The Way",  dispTitle: "Technician On The Way",      custTitle: "Technician Is On The Way",            custDesc: (b, t) => `${t} is on the way to your location for booking ${b}.` },
      fivemin:   { bookingStatus: "On The Way",  dispTitle: "Technician 5 Min Away",      custTitle: "Technician Arriving in 5 Minutes!",   custDesc: (b, t) => `${t} is just 5 minutes away from your location for booking ${b}. Please be ready.` },
      arrived:   { bookingStatus: "In Progress", dispTitle: "Technician Arrived",         custTitle: "Technician Has Arrived",              custDesc: (b, t) => `${t} has arrived at your location for booking ${b}. Work will begin shortly.` },
    };
    const s = statusMap[statusType];
    if (!s) return;
    let techName = "";
    const updater = b => {
      if (b.id === bookingId) {
        techName = b.technicianName;
        return {
          ...b,
          status: s.bookingStatus,
          lastUpdate: statusType,
          lastUpdateTime: new Date().toISOString(),
          // Location stored on booking — dispatcher can see, customer cannot
          ...(location ? { technicianLocation: location } : {}),
        };
      }
      return b;
    };
    setBookings(prev => prev.map(updater));
    setEmergencies(prev => prev.map(updater));

    setTimeout(() => {
      // Dispatcher gets location info
      const locStr = location ? ` | Location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "";
      addDispNotif({
        type: s.dispTitle, category: "journey", title: s.dispTitle,
        description: `${techName || "Technician"} updated status for ${bookingId}.${locStr} Customer has been automatically notified.`,
        icon: "journey",
      });
      // Customer gets status update automatically — NO location
      addCustomerNotif({
        type: s.custTitle, bookingId,
        title: s.custTitle,
        description: s.custDesc(bookingId, techName || "Your technician"),
        icon: "journey",
      });
      addAdminNotif({
        type: s.dispTitle, category: "booking", title: s.dispTitle,
        description: `${techName || "Technician"} updated status for ${bookingId}: ${s.dispTitle}`,
        icon: "journey",
      });
    }, 0);
  }, [addDispNotif, addAdminNotif, addCustomerNotif]);

  const customerMarkCompleted = useCallback((bookingId) => {
    let techId = null;
    const updater = b => { if (b.id === bookingId) { techId = b.technicianId; return { ...b, status: "Completed", customerConfirmed: true }; } return b; };
    setBookings(prev => prev.map(updater));
    setEmergencies(prev => prev.map(updater));
    if (techId) setTechnicians(prev => prev.map(t => t.id === techId ? { ...t, availability: "Available", currentBooking: null } : t));
    addDispNotif({ type: "Job Completed", category: "completed", title: "Customer Confirmed Completion", description: `Customer confirmed ${bookingId} completed. Technician marked available.`, icon: "completed" });
    addAdminNotif({ type: "Job Completed", category: "booking", title: "Booking Completed", description: `${bookingId} marked completed by customer.`, icon: "completed" });
  }, [addDispNotif, addAdminNotif]);

  const qualifyToNormal = useCallback((emergencyId, reason) => {
    const em = emergencies.find(e => e.id === emergencyId);
    if (!em) return;
    setBookings(prev => [{ ...em, priority: "Normal", emergency: false, qualifiedFrom: emergencyId, qualifyReason: reason, status: "Pending" }, ...prev]);
    setEmergencies(prev => prev.filter(e => e.id !== emergencyId));
    addDispNotif({ type: "Emergency Qualified", category: "booking", title: "Emergency Downgraded to Normal", description: `${emergencyId} reclassified as normal booking. Reason: ${reason}`, icon: "booking" });
    addAdminNotif({ type: "Emergency Qualified", category: "booking", title: "Emergency Downgraded", description: `${emergencyId} reclassified as normal by dispatcher. Reason: ${reason}`, icon: "booking" });
  }, [emergencies, addDispNotif, addAdminNotif]);

  const createBooking = useCallback((booking) => {
    const newBooking = { ...booking, id: `BK-${Date.now()}`, status: "Pending", technicianId: null, technicianName: null, createdAt: new Date().toISOString() };
    if (booking.emergency) {
      setEmergencies(prev => [{ ...newBooking, emergencyLevel: "High", broadcastSent: false }, ...prev]);
    } else {
      setBookings(prev => [newBooking, ...prev]);
    }
    addDispNotif({ type: "New Booking", category: "booking", title: booking.emergency ? "🚨 New Emergency Booking" : "New Booking Received", description: `New ${booking.emergency ? "EMERGENCY " : ""}booking from ${booking.customer} for ${booking.category}. Assign a technician.`, icon: booking.emergency ? "alert" : "booking" });
    addAdminNotif({ type: "New Booking", category: "booking", title: "New Booking Created", description: `${booking.category} booking by ${booking.customer}.`, icon: "booking" });
    return newBooking;
  }, [addDispNotif, addAdminNotif]);

  return (
    <AppContext.Provider value={{
      bookings, emergencies, cancelledBookings, technicians,
      adminNotifs, dispNotifs, customerNotifs,
      setAdminNotifs, setDispNotifs, setCustomerNotifs,
      getLiveStats,
      assignTechnician, technicianCancel, reassignBooking,
      updateTechnicianStatus, customerMarkCompleted,
      qualifyToNormal, createBooking,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStore");
  return ctx;
};
