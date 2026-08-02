"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const DispatcherContext = createContext(null);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export function DispatcherStoreProvider({ children }) {
    const [bookings, setBookings] = useState([]);
    const [emergencies, setEmergencies] = useState([]);
    const [cancelledBookings, setCancelledBookings] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [dispNotifs, setDispNotifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setFetchError(null);
            try {
                const [statsRes, notifsRes] = await Promise.all([
                    safeFetchJson(`${API}/dispatcher/dashboard-stats`),
                    safeFetchJson(`${API}/notifications?role=DISPATCHER`)
                ]);

                const mapTech = t => ({
                    id: t.technician_id || t.id,
                    name: t.users?.full_name || t.name || `Tech ${t.technician_id || ''}`,
                    phone: t.users?.phone || t.phone || '',
                    email: t.users?.email || '',
                    category: t.category_id === 1 ? 'Plumbing' : t.category_id === 2 ? 'Electrical' : t.category_id === 3 ? 'AC Repair' : t.category_id === 5 ? 'Painting' : t.category_id === 6 ? 'Carpentry' : 'Maintenance',
                    availability: t.availability_status || 'Available',
                    avgRating: Number(t.rating || 4.5),
                    completedJobs: 0,
                    delayedJobs: 0,
                    currentBooking: null
                });

                const mapBooking = b => ({
                    id: b.booking_id || b.id,
                    customer: b.customers?.full_name || b.customer || `Customer ${b.customer_id || ''}`,
                    category: b.category_id === 1 ? 'Plumbing' : b.category_id === 2 ? 'Electrical' : b.category_id === 3 ? 'AC Repair' : b.category_id === 5 ? 'Painting' : b.category_id === 6 ? 'Carpentry' : (b.category || 'Maintenance'),
                    status: b.booking_status || b.status,
                    priority: b.priority || 'Normal',
                    emergency: !!b.emergency_flag,
                    technicianId: b.technician_id,
                    technicianName: b.technicians?.users?.full_name || b.technicianName || null,
                    address: [b.house_number, b.street, b.area, b.city].filter(Boolean).join(', ') || b.address || b.street || '',
                    createdAt: b.created_at || b.createdAt,
                    scheduledAt: b.preferred_date || b.scheduled_at || b.created_at || new Date().toISOString(),
                    issue: b.issue_description || b.description || b.issue || '',
                    cancelledBy: b.cancelled_by ? 'Customer' : null,
                    cancelledAt: b.cancelled_at || b.updated_at,
                    reason: b.cancellation_reason || 'No reason provided',
                    needsReassign: b.booking_status === 'Cancelled' && !!b.technician_id
                });

                if (statsRes?.success) {
                    const rawBookings = (statsRes.bookings || []).map(mapBooking);
                    const rawEmergencies = (statsRes.emergencies || []).map(mapBooking);
                    const rawTechs = (statsRes.technicians || []).map(mapTech);

                    // Attach current active booking to each busy technician
                    const allActive = [...rawBookings, ...rawEmergencies].filter(b =>
                        ["Assigned","Accepted","On The Way","Arrived","Working","In Progress"].includes(b.status)
                    );
                    const enrichedTechs = rawTechs.map(t => {
                        const activeJob = allActive.find(b => b.technicianId === t.id);
                        return { ...t, currentBooking: activeJob ? `#${activeJob.id} — ${activeJob.customer}` : null };
                    });

                    setBookings(rawBookings);
                    setEmergencies(rawEmergencies);
                    setCancelledBookings((statsRes.cancelledBookings || []).map(mapBooking));
                    setTechnicians(enrichedTechs);
                }
                if (notifsRes?.success) {
                    setDispNotifs((notifsRes.notifications || []).map(n => ({ ...n, id: n.notification_id || n.id, read: Boolean(n.is_read) })));
                }
            } catch (err) {
                console.error("Failed to fetch dispatcher data:", err);
                setFetchError(err.message || "Failed to load dispatcher data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addDispNotif = useCallback((notif) => {
        setDispNotifs(prev => [{ ...notif, id: `DN-${Date.now()}`, read: false, time: "Just now" }, ...prev]);
    }, []);

    const getLiveStats = useCallback(() => {
        const all = [...bookings, ...emergencies];
        const pending = all.filter(b => b.status === "Pending").length;
        const availTechs = technicians.filter(t => (t.availability || "Available") === "Available").length;
        const busyTechs = technicians.filter(t => (t.availability || "Available") === "Busy").length;
        const todayStart = new Date(); todayStart.setHours(0,0,0,0);
        const cancelledToday = cancelledBookings.filter(b => b.cancelledAt && new Date(b.cancelledAt) >= todayStart).length;
        return {
            dispatcher: {
                pendingBookings: pending,
                availableTechnicians: availTechs,
                busyTechnicians: busyTechs,
                emergencyJobs: emergencies.filter(e => e.status === "Pending").length,
                cancelledToday,
            }
        };
    }, [bookings, emergencies, cancelledBookings, technicians]);

    const assignTechnician = async (bookingId, tech, isEmergency = false) => {
        try {
            await fetch(`${API}/dispatcher/assign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, technicianId: tech.id })
            });
            // Optimistic update
            const updater = b => b.id === bookingId ? { ...b, technicianId: tech.id, technicianName: tech.name, status: "Assigned" } : b;
            if (isEmergency) setEmergencies(prev => prev.map(updater));
            else setBookings(prev => prev.map(updater));
            addDispNotif({ type: "Technician Assigned", title: "Assigned", description: "Technician API call successful." });
        } catch (err) {
            console.error(err);
        }
    };

    const reassignBooking = async (cancelledBookingId, tech) => {
        try {
            const target = cancelledBookings.find(b => b.id === cancelledBookingId);
            await fetch(`${API}/dispatcher/reassign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId: cancelledBookingId,
                    oldTechnicianId: target?.technicianId ?? null,
                    newTechnicianId: tech.id,
                    reassignReason: "Reassigned by Dispatcher",
                    dispatcherUserId: null
                })
            });
            const updater = b => b.id === cancelledBookingId ? { ...b, technicianId: tech.id, technicianName: tech.name, status: "Assigned" } : b;
            setCancelledBookings(prev => prev.map(updater));
            addDispNotif({ type: "Reassignment", title: "Job Reassigned", description: `Reassigned to ${tech.name}` });
        } catch (err) {
            console.error(err);
        }
    };

const CATEGORY_MAP = {
    "Plumber": 1, "Electrician": 2, "AC Repair": 3, "Painter": 5, "Carpenter": 6
};
const PROBLEM_MAP = {
    "Plumber": 1, "Electrician": 9, "AC Repair": 10, "Painter": 12, "Carpenter": 13
};

const createBooking = async (booking) => {
    try {
        const preferredDate = booking.scheduledAt ? booking.scheduledAt.split("T")[0] : null;
        const preferredTime = booking.scheduledAt ? booking.scheduledAt.split("T")[1]?.split(".")[0] : null;

        const customerResponse = await fetch(
            `${API}/dispatcher/customer?phone=${encodeURIComponent(booking.phone)}`
        );
        const customerData = await customerResponse.json();
        const customer = customerData.success ? customerData.customer : null;

        const response = await fetch(`${API}/dispatcher/manual-booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId: customer?.user_id ?? null,
                categoryId: CATEGORY_MAP[booking.category] ?? null,
                problemId: PROBLEM_MAP[booking.category] ?? null,
                issueDescription: booking.issue,
                priority: booking.priority,
                emergencyFlag: booking.emergency,
                emergencyReason: booking.emergency ? "Manual Emergency" : null,
                preferredDate,
                preferredTime,
                houseNumber: "",
                apartmentName: "",
                street: booking.address,
                area: "",
                city: "",
                state: "",
                pincode: "",
                dispatcherUserId: null
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Booking creation failed");
            return;
        }

        setBookings((prev) => [
            {
                id: data.booking.booking_id,
                customer: customer ? customer.full_name : booking.customer,
                category: data.booking.category_id,
                status: data.booking.booking_status,
                priority: data.booking.priority,
                emergency: data.booking.emergency_flag,
                issue: data.booking.issue_description,
                address: data.booking.street,
                createdAt: data.booking.created_at,
            },
            ...prev,
        ]);

        addDispNotif({
            type: "Manual Booking",
            title: "Booking Created",
            description: `Booking #${data.booking.booking_id} created successfully.`,
        });

        return {
            id: data.booking.booking_id,
            customer: booking.customer,
            category: booking.category,
            priority: booking.priority,
            emergency: booking.emergency
        };
    } catch (err) {
        console.error(err);
    }
};

    const qualifyToNormal = async (emergencyId, reason) => {
        try {
            await fetch(`${API}/dispatcher/emergency/downgrade`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: emergencyId, reason, dispatcherUserId: null })
            });
            const targetBooking = emergencies.find(b => b.id === emergencyId);
            if (targetBooking) {
                const updated = { ...targetBooking, emergency: false, priority: "Normal" };
                setEmergencies(prev => prev.filter(b => b.id !== emergencyId));
                setBookings(prev => [updated, ...prev]);
            }
            addDispNotif({ type: "Downgrade", title: "Emergency Downgraded", description: "Job reclassified as normal." });
        } catch (err) {
            console.error(err);
        }
    };

    const updateTechnicianStatus = async (bookingId, statusType, location = null) => {
        try {
            await fetch(`${API}/dispatcher/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status: statusType, role: 'TECHNICIAN' })
            });
            const labelKey = statusType?.toLowerCase();
            const updater = b => b.id === bookingId ? {
                ...b,
                status: statusType === 'completed' ? 'Completed' : b.status,
                lastUpdate: labelKey,
                lastUpdateTime: new Date().toISOString(),
                technicianLocation: location
            } : b;
            setBookings(prev => prev.map(updater));
            setEmergencies(prev => prev.map(updater));
            addDispNotif({ type: "Status Update", title: `Status Updated`, description: `Technician transitioned to ${statusType}` });
        } catch (err) {
            console.error(err);
        }
    };

    const customerMarkCompleted = async (bookingId) => {
        try {
            await fetch(`${API}/dispatcher/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status: "Completed", role: 'CUSTOMER' })
            });
            const updater = b => b.id === bookingId ? { ...b, status: "Completed" } : b;
            setBookings(prev => prev.map(updater));
            setEmergencies(prev => prev.map(updater));
        } catch (err) {
            console.error(err);
        }
    };

    const markNotifsReadAsync = async () => {
        try {
            await fetch(`${API}/notifications/mark-read`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: "DISPATCHER" })
            });
            setDispNotifs(n => n.map(x => ({ ...x, read: true, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DispatcherContext.Provider value={{
            bookings, emergencies, cancelledBookings, technicians, dispNotifs, setDispNotifs, markNotifsReadAsync,
            getLiveStats, assignTechnician, reassignBooking, createBooking,
            qualifyToNormal, updateTechnicianStatus, customerMarkCompleted,
            loading, fetchError
        }}>
            {children}
        </DispatcherContext.Provider>
    );
}

export const useDispatcherStore = () => {
    const ctx = useContext(DispatcherContext);
    if (!ctx) throw new Error("useDispatcherStore must be used within DispatcherStoreProvider");
    return ctx;
};
