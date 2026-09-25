import { Request, Response } from "express";
import supabaseAdmin from "../config/supabase.js";

// =========================
// BUILD NOTIFICATION FILTER
// =========================

const buildNotifFilter = (
    role?: string,
    userId?: string
): string => {
    const parts: string[] = [];

    // Broadcast notifications
    parts.push("recipient_role.eq.ALL");

    if (role && userId) {
        parts.push(
            `and(recipient_role.eq.${role},user_id.eq.${userId})`
        );
    } else if (role) {
        parts.push(`recipient_role.eq.${role}`);
    } else if (userId) {
        parts.push(`user_id.eq.${userId}`);
    }

    return parts.join(",");
};

// =========================
// GET NOTIFICATIONS
// =========================

const getNotifications = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { role, userId, notificationType } = req.query;

    const roleValue =
        typeof role === "string" ? role : undefined;

    const userIdValue =
        typeof userId === "string" ? userId : undefined;

    const notificationTypeValue =
        typeof notificationType === "string"
            ? notificationType
            : undefined;

    if (!roleValue && !userIdValue) {
        return res.status(400).json({
            error: "role or userId is required",
        });
    }

    try {
        let query = supabaseAdmin
            .from("notifications")
            .select("*")
            .or(
                buildNotifFilter(
                    roleValue,
                    userIdValue
                )
            )
            .order("created_at", {
                ascending: false,
            })
            .limit(100);

        // Notification type filtering
        if (
            notificationTypeValue &&
            notificationTypeValue !== "ALL"
        ) {
            query = query.eq(
                "notification_type",
                notificationTypeValue
            );
        }

        // Role-based filtering
        if (roleValue === "TECHNICIAN") {
            query = query.in(
                "notification_type",
                [
                    "Emergency",
                    "Assignment",
                ]
            );
        } else if (roleValue === "CUSTOMER") {
            query = query.in(
                "notification_type",
                [
                    "Booking",
                    "Assignment",
                    "Cancellation",
                ]
            );
        }

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            notifications: data,
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Something went wrong.";

        return res.status(500).json({
            error: message,
        });
    }
};

// =========================
// GET UNREAD BADGE COUNT
// =========================

const getUnreadBadgeCount = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { role, userId } = req.query;

    const roleValue =
        typeof role === "string" ? role : undefined;

    const userIdValue =
        typeof userId === "string" ? userId : undefined;

    if (!roleValue && !userIdValue) {
        return res.status(400).json({
            error: "role or userId is required",
        });
    }

    try {
        const { count, error } = await supabaseAdmin
            .from("notifications")
            .select("*", {
                count: "exact",
                head: true,
            })
            .or(
                buildNotifFilter(
                    roleValue,
                    userIdValue
                )
            )
            .eq("is_read", false);

        if (error) {
            throw error;
        }

        return res.status(200).json({
            unreadCount: count || 0,
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Something went wrong.";

        return res.status(500).json({
            error: message,
        });
    }
};

// =========================
// MARK ALL NOTIFICATIONS READ
// =========================

const markAllNotificationsRead = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { role, userId } = req.body;

    const roleValue =
        typeof role === "string" ? role : undefined;

    const userIdValue =
        typeof userId === "string"
            ? userId
            : userId !== undefined && userId !== null
                ? String(userId)
                : undefined;

    if (!roleValue && !userIdValue) {
        return res.status(400).json({
            error: "role or userId is required",
        });
    }

    try {
        const { error } = await supabaseAdmin
            .from("notifications")
            .update({
                is_read: true,
            })
            .or(
                buildNotifFilter(
                    roleValue,
                    userIdValue
                )
            );

        if (error) {
            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Something went wrong.";

        return res.status(500).json({
            error: message,
        });
    }
};

// =========================
// EXPORTS
// =========================

export {
    getNotifications,
    getUnreadBadgeCount,
    markAllNotificationsRead,
};