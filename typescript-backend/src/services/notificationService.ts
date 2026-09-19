const { supabaseAdmin } = require('../config/supabase');

type IdType = string | number;

type RoleType = 'CUSTOMER' | 'TECHNICIAN' | 'DISPATCHER' | 'ADMIN' | 'ALL' | string;

type PriorityType = 'Low' | 'Medium' | 'High' | string;

// Structure of the incoming notification parameters object
export type NotificationParams = {
  recipientRole: RoleType;
  userId?: IdType | null;
  bookingId?: IdType | null;
  title: string;
  description: string;
  notificationType: string;
  priority?: PriorityType;
};

// Error interface for catch blocks
type CustomError = {
  message?: string;
};

// ==========================================
// 2. SERVICE FUNCTIONS
// ==========================================

export const createNotification = async ({
  recipientRole,
  userId,
  bookingId,
  title,
  description,
  notificationType,
  priority
}: NotificationParams): Promise<void> => {
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
  } catch (err) {
    const error = err as CustomError;
    console.error('Failed to create notification:', error.message || err);
  }
};

export default { createNotification };
