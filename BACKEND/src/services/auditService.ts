import supabaseAdmin from "../config/supabase.js";

const logAuditEvent = async (
    userId: number | null | undefined,
    userRole: string | null | undefined,
    actionType: string,
    description: string
): Promise<void> => {
    try {
        if (!userId) {
            return;
        }

        const { error } = await supabaseAdmin
            .from("activity_logs")
            .insert([
                {
                    user_id: userId,
                    activity_type: "Administrative Action",
                    activity_description: `[${userRole || "SYSTEM"}] ${actionType}: ${description}`,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error(
                "Failed to log audit event:",
                error.message
            );
        }
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Unknown error";

        console.error(
            "Audit service error:",
            message
        );
    }
};

export { logAuditEvent };