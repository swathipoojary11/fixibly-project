import supabase from '../config/supabase.js';

export const createNotification = async ({ recipientRole, userId, bookingId, title, description, notificationType, priority }) => {
  try {
    const { error } = await supabase.from('notifications').insert([
      {
        recipient_role: recipientRole || 'ALL',
        user_id: userId || null,
        booking_id: bookingId || null,
        title,
        description,
        notification_type: notificationType || 'System',
        priority: priority || 'Medium',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) console.error('Notification Insert Error:', error.message);
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

export default { createNotification };