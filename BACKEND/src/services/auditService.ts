
const { supabaseAdmin } = require('../config/supabase');

const logAuditEvent = async (userId, userRole, actionType, description) => {
  try {
    if (!userId) return; // user_id is NOT NULL in DB — skip if no user
    const { error } = await supabaseAdmin
      .from('activity_logs')
      .insert([{
        user_id: userId,
        activity_type: 'Administrative Action',
        activity_description: `[${userRole || 'SYSTEM'}] ${actionType}: ${description}`,
        created_at: new Date().toISOString()
      }]);
    if (error) console.error('Failed to log audit event:', error.message);
  } catch (err) {
    console.error('Audit service error:', err.message);
  }
};

module.exports = { logAuditEvent };
