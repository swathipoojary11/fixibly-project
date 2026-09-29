
const { supabaseAdmin } = require('../config/supabase');

type IdType = string | number;

type CustomError = {
  message?: string;
};

// ==========================================
// 2. AUDIT LOGGING FUNCTION
// ==========================================

export const logAuditEvent = async (
  userId?: IdType | null,
  userRole?: string | null,
  actionType?: string,
  description?: string
): Promise<void> => {
  try {
    // user_id is NOT NULL in DB — skip if no user provided
    if (!userId) return;

    const roleTag: string = userRole || 'SYSTEM';
    const actionTag: string = actionType || 'Action';
    const detailText: string = description || '';

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
  } catch (err) {
    const error = err as CustomError;
    console.error('Audit service error:', error.message || 'Unknown error');
  }
};

export default { logAuditEvent };