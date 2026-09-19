"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const { supabaseAdmin } = require('../config/supabase');
// ==========================================
// 2. SERVICE FUNCTIONS
// ==========================================
const createNotification = async ({ recipientRole, userId, bookingId, title, description, notificationType, priority }) => {
    try {
        const { error } = await supabaseAdmin.from('notifications').insert([
            {
                recipient_role: recipientRole,
                user_id: userId || null,
                booking_id: bookingId || null,
                title,
                description,
                notification_type: notificationType,
                priority: priority || 'Medium',
                is_read: false,
                created_at: new Date().toISOString()
            }
        ]);
        if (error) {
            console.error('Notification Insert Error:', error.message);
        }
    }
    catch (err) {
        const error = err;
        console.error('Failed to create notification:', error.message || err);
    }
};
exports.createNotification = createNotification;
exports.default = { createNotification: exports.createNotification };
//# sourceMappingURL=notificationService.js.map