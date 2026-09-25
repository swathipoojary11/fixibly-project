import { Request, Response } from "express";
import supabaseAdmin from "../config/supabase.js";
import { createNotification } from "../services/notificationService.js";
import { logAuditEvent } from "../services/auditService.js";

interface AuthenticatedRequest extends Request {
    user?: {
        user_id: number;
        technician_id?: number;
    };
}

interface Booking {
    booking_id?: number;
    id?: number;
    customer_id?: number;
    technician_id?: number;
    status?: string;
    emergency?: boolean;
    is_emergency?: boolean;
    latitude?: number;
    longitude?: number;
    location?: unknown;
    [key: string]: unknown;
}

interface Technician {
    technician_id?: number;
    user_id?: number;
    full_name?: string;
    name?: string;
    status?: string;
    availability_status?: string;
    is_available?: boolean;
    [key: string]: unknown;
}

interface Location {
    latitude?: number;
    longitude?: number;
    [key: string]: unknown;
}

interface NotificationData {
    user_id?: number;
    recipient_role?: string;
    notification_type?: string;
    message?: string;
    [key: string]: unknown;
}

const getErrorMessage = (err: unknown): string => {
    return err instanceof Error ? err.message : "Something went wrong.";
};

const getQueryString = (value: unknown): string | undefined => {
    return typeof value === "string" ? value : undefined;
};

/* =========================================================
   ASSIGN TECHNICIAN
========================================================= */

const assignTechnician = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId, technicianId } = req.body;

        if (!bookingId || !technicianId) {
            return res.status(400).json({
                success: false,
                message: "bookingId and technicianId are required",
            });
        }

        const { data: booking, error: bookingError } = await supabaseAdmin
            .from("bookings")
            .select("*")
            .eq("booking_id", bookingId)
            .single();

        if (bookingError || !booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        const { data: technician, error: technicianError } =
            await supabaseAdmin
                .from("technicians")
                .select("*")
                .eq("technician_id", technicianId)
                .single();

        if (technicianError || !technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({
                technician_id: technicianId,
                status: "ASSIGNED",
                updated_at: new Date(),
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        try {
            await createNotification({
                user_id: technician.user_id,
                recipient_role: "TECHNICIAN",
                notification_type: "Assignment",
                message: `A new booking has been assigned to you.`,
            } as NotificationData);
        } catch (notificationError) {
            console.error(
                "Notification error:",
                getErrorMessage(notificationError)
            );
        }

        return res.status(200).json({
            success: true,
            message: "Technician assigned successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   REASSIGN TECHNICIAN
========================================================= */

const reassignTechnician = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId, technicianId } = req.body;

        if (!bookingId || !technicianId) {
            return res.status(400).json({
                success: false,
                message: "bookingId and technicianId are required",
            });
        }

        const { data: technician, error: technicianError } =
            await supabaseAdmin
                .from("technicians")
                .select("*")
                .eq("technician_id", technicianId)
                .single();

        if (technicianError || !technician) {
            return res.status(404).json({
                success: false,
                message: "Technician not found",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({
                technician_id: technicianId,
                status: "ASSIGNED",
                updated_at: new Date(),
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        try {
            await createNotification({
                user_id: technician.user_id,
                recipient_role: "TECHNICIAN",
                notification_type: "Assignment",
                message: "A booking has been reassigned to you.",
            } as NotificationData);
        } catch (notificationError) {
            console.error(
                "Notification error:",
                getErrorMessage(notificationError)
            );
        }

        return res.status(200).json({
            success: true,
            message: "Technician reassigned successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   GET DISPATCHER PROFILE
========================================================= */

const getDispatcherProfile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<Response> => {
    try {
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("users")
            .select(
                `
                user_id,
                full_name,
                email,
                phone,
                address,
                is_active,
                created_at,
                updated_at,
                roles(role_name)
            `
            )
            .eq("user_id", userId)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Dispatcher profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            user: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   UPDATE BOOKING STATUS
========================================================= */

const updateBookingStatus = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId, status } = req.body;

        if (!bookingId || !status) {
            return res.status(400).json({
                success: false,
                message: "bookingId and status are required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({
                status,
                updated_at: new Date(),
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   DISPATCHER DASHBOARD STATS
========================================================= */

const getDispatcherDashboardStats = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { data: bookings, error } = await supabaseAdmin
            .from("bookings")
            .select("*");

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        const bookingList: Booking[] = (bookings ?? []) as Booking[];

        const totalBookings = bookingList.length;

        const pendingBookings = bookingList.filter(
            (b: Booking) => b.status === "PENDING"
        ).length;

        const assignedBookings = bookingList.filter(
            (b: Booking) => b.status === "ASSIGNED"
        ).length;

        const completedBookings = bookingList.filter(
            (b: Booking) => b.status === "COMPLETED"
        ).length;

        const emergencyBookings = bookingList.filter(
            (b: Booking) =>
                b.emergency === true || b.is_emergency === true
        ).length;

        return res.status(200).json({
            success: true,
            stats: {
                totalBookings,
                pendingBookings,
                assignedBookings,
                completedBookings,
                emergencyBookings,
            },
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   SEARCH CUSTOMERS
========================================================= */

const searchCustomers = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const search = getQueryString(req.query.search);

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search value is required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("users")
            .select(
                `
                user_id,
                full_name,
                email,
                phone,
                address
            `
            )
            .or(
                `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
            )
            .limit(20);

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            customers: data ?? [],
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   TRIGGER EMERGENCY BROADCAST
========================================================= */

const triggerEmergencyBroadcast = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId, message } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId is required",
            });
        }

        const { data: technicians, error } = await supabaseAdmin
            .from("technicians")
            .select("*");

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        const technicianList: Technician[] =
            (technicians ?? []) as Technician[];

        for (const t of technicianList) {
            if (t.user_id) {
                try {
                    await createNotification({
                        user_id: t.user_id,
                        recipient_role: "TECHNICIAN",
                        notification_type: "Emergency",
                        message:
                            message ??
                            `Emergency booking ${bookingId} requires attention.`,
                    } as NotificationData);
                } catch (notificationError) {
                    console.error(
                        "Notification error:",
                        getErrorMessage(notificationError)
                    );
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: "Emergency broadcast triggered successfully",
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   SEARCH CUSTOMER BY PHONE
========================================================= */

const searchCustomerByPhone = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const phone = getQueryString(req.query.phone);

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("users")
            .select(
                `
                user_id,
                full_name,
                email,
                phone,
                address
            `
            )
            .eq("phone", phone)
            .single();

        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        return res.status(200).json({
            success: true,
            customer: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   CREATE MANUAL BOOKING
========================================================= */

const createManualBooking = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const {
            customer_id,
            service_type,
            description,
            address,
            latitude,
            longitude,
            emergency,
        } = req.body;

        if (!customer_id || !service_type) {
            return res.status(400).json({
                success: false,
                message: "customer_id and service_type are required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .insert({
                customer_id,
                service_type,
                description,
                address,
                latitude,
                longitude,
                emergency: emergency ?? false,
                status: "PENDING",
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        try {
            await logAuditEvent({
                action: "CREATE_MANUAL_BOOKING",
                entity_type: "booking",
                entity_id: data?.booking_id,
            });
        } catch (auditError) {
            console.error("Audit error:", getErrorMessage(auditError));
        }

        return res.status(201).json({
            success: true,
            message: "Manual booking created successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   DOWNGRADE EMERGENCY
========================================================= */

const downgradeEmergency = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId is required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({
                emergency: false,
                is_emergency: false,
                updated_at: new Date(),
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Emergency status downgraded successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   TECHNICIAN SUMMARY STATS
========================================================= */

const getTechnicianSummaryStats = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { data: technicians, error } = await supabaseAdmin
            .from("technicians")
            .select("*");

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        const technicianList: Technician[] =
            (technicians ?? []) as Technician[];

        const totalTechnicians = technicianList.length;

        const availableTechnicians = technicianList.filter(
            (t: Technician) =>
                t.is_available === true ||
                t.availability_status === "AVAILABLE" ||
                t.status === "AVAILABLE"
        ).length;

        const busyTechnicians = technicianList.filter(
            (t: Technician) =>
                t.availability_status === "BUSY" ||
                t.status === "BUSY"
        ).length;

        return res.status(200).json({
            success: true,
            stats: {
                totalTechnicians,
                availableTechnicians,
                busyTechnicians,
            },
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   GET ACTIVE BOOKINGS WITH LOCATION
========================================================= */

const getActiveBookingsWithLocation = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { data: bookings, error } = await supabaseAdmin
            .from("bookings")
            .select("*")
            .in("status", ["PENDING", "ASSIGNED", "IN_PROGRESS"]);

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        const bookingList: Booking[] = (bookings ?? []) as Booking[];

        const locations: Location[] = bookingList
            .filter(
                (booking: Booking) =>
                    booking.latitude !== undefined &&
                    booking.longitude !== undefined
            )
            .map((booking: Booking) => ({
                booking_id: booking.booking_id ?? booking.id,
                latitude: booking.latitude,
                longitude: booking.longitude,
                status: booking.status,
            }));

        return res.status(200).json({
            success: true,
            bookings: bookingList,
            locations,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   ACCEPT EMERGENCY BROADCAST
========================================================= */

const acceptEmergencyBroadcast = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { bookingId, technicianId } = req.body;

        if (!bookingId || !technicianId) {
            return res.status(400).json({
                success: false,
                message: "bookingId and technicianId are required",
            });
        }

        const { data, error } = await supabaseAdmin
            .from("bookings")
            .update({
                technician_id: technicianId,
                status: "ASSIGNED",
                emergency: true,
                is_emergency: true,
                updated_at: new Date(),
            })
            .eq("booking_id", bookingId)
            .select()
            .single();

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        try {
            const { data: technician } = await supabaseAdmin
                .from("technicians")
                .select("user_id")
                .eq("technician_id", technicianId)
                .single();

            if (technician?.user_id) {
                await createNotification({
                    user_id: technician.user_id,
                    recipient_role: "TECHNICIAN",
                    notification_type: "Emergency",
                    message: `Emergency booking ${bookingId} accepted.`,
                } as NotificationData);
            }
        } catch (notificationError) {
            console.error(
                "Notification error:",
                getErrorMessage(notificationError)
            );
        }

        return res.status(200).json({
            success: true,
            message: "Emergency broadcast accepted successfully",
            booking: data,
        });
    } catch (err: unknown) {
        return res.status(500).json({
            success: false,
            message: getErrorMessage(err),
        });
    }
};

/* =========================================================
   EXPORTS
========================================================= */

export {
    assignTechnician,
    reassignTechnician,
    getDispatcherProfile,
    updateBookingStatus,
    getDispatcherDashboardStats,
    searchCustomers,
    triggerEmergencyBroadcast,
    searchCustomerByPhone,
    createManualBooking,
    downgradeEmergency,
    getTechnicianSummaryStats,
    getActiveBookingsWithLocation,
    acceptEmergencyBroadcast,
};