const { supabaseAdmin } = require('../config/supabase');

const getNotifications = async (req, res) => {
  const { role, userId, notificationType } = req.query;

  try {
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .or(`recipient_role.eq.${role},recipient_role.eq.ALL,user_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (notificationType && notificationType !== 'ALL') {
      query = query.eq('notification_type', notificationType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, notifications: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getUnreadBadgeCount = async (req, res) => {
  const { role, userId } = req.query;

  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .or(`recipient_role.eq.${role},recipient_role.eq.ALL,user_id.eq.${userId}`)
      .eq('is_read', false);

    if (error) throw error;

    return res.status(200).json({ unreadCount: count || 0 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  const { role, userId } = req.body;

  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .or(`recipient_role.eq.${role},user_id.eq.${userId}`);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, getUnreadBadgeCount, markAllNotificationsRead };