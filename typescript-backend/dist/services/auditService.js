"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditEvent = void 0;
const { supabaseAdmin } = require('../config/supabase');
// ==========================================
// 2. AUDIT LOGGING FUNCTION
// ==========================================
const logAuditEvent = async (userId, userRole, actionType, description) => {
    try {
        // user_id is NOT NULL in DB — skip if no user provided
        if (!userId)
            return;
        const roleTag = userRole || 'SYSTEM';
        const actionTag = actionType || 'Action';
        const detailText = description || '';
        const { error } = await supabaseAdmin
            .from('activity_logs')
            .insert([
            {
                user_id: userId,
                activity_type: 'Administrative Action',
                activity_description: `[${roleTag}] ${actionTag}: ${detailText}`,
                created_at: new Date().toISOString()
            }
        ]);
        if (error) {
            console.error('Failed to log audit event:', error.message);
        }
    }
    catch (err) {
        const error = err;
        console.error('Audit service error:', error.message || 'Unknown error');
    }
};
exports.logAuditEvent = logAuditEvent;
exports.default = { logAuditEvent: exports.logAuditEvent };
//# sourceMappingURL=auditService.js.map