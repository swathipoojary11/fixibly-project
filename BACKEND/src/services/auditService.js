import supabase from '../config/supabase.js';

/**
 * Logs a system audit or user action event into the activity_logs table.
 */
export const logAuditEvent = async (userId, userRole, actionType, description, bookingId = null) => {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: userId || 1,
          booking_id: bookingId || null,
          activity_type: actionType || 'Administrative Action',
          activity_description: description,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Audit log notice:', error.message);
    }
  } catch (err) {
    console.error('Audit service error:', err.message);
  }
};

export default { logAuditEvent };