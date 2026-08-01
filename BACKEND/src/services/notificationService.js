const { supabaseAdmin } = require('../config/supabase');

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
        priority: priority || 'NORMAL',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ]);
    if (error) console.error('Notification Insert Error:', error.message);
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

module.exports = { createNotification };