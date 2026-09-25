import supabaseAdmin from "../config/supabase.js";

interface NotificationData {
    recipientRole: string;
    userId?: number | null;
    bookingId?: number | null;
    title: string;
    description: string;
    notificationType: string;
    priority?: string;
}

const createNotification = async ({
    recipientRole,
    userId,
    bookingId,
    title,
    description,
    notificationType,
    priority
}: NotificationData): Promise<void> => {
    try {
        const { error } = await supabaseAdmin
            .from("notifications")
            .insert([
                {
                    recipient_role: recipientRole,
                    user_id: userId || null,
                    booking_id: bookingId || null,
                    title,
                    description,
                    notification_type: notificationType,
                    priority: priority || "Medium",
                    is_read: false,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error(
                "Notification Insert Error:",
                error.message
            );
        }
    } catch (err: unknown) {
        console.error(
            "Failed to create notification:",
            err
        );
    }
};

export { createNotification };