
const { supabaseAdmin } = require('../config/supabase');

/**
 * Logs a system audit or user action event into the database.
 * 
 * @param {string} userId - The ID of the user performing the action (Admin, Dispatcher, etc.)
 * @param {string} userRole - The role of the user (e.g., 'ADMIN', 'DISPATCHER')
 * @param {string} actionType - The type of action (e.g., 'TECHNICIAN_ASSIGNED', 'BOOKING_CANCELLED')
 * @param {string} description - Details about what took place
 */
const logAuditEvent = async (userId, userRole, actionType, description) => {
  try {
    const { error } = await supabaseAdmin
      .from('system_audit_logs') // Matches your schema table
      .insert([
        {
          user_id: userId || null,
          role: userRole || 'SYSTEM',
          activity_type: actionType,
          activity_description: description,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Failed to log audit event:', error.message);
    }
  } catch (err) {
    console.error('Audit service error:', err.message);
  }
};

module.exports = {
  logAuditEvent
};