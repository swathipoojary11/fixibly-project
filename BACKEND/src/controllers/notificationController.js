import supabase from '../config/supabase.js';

export const getNotifications = async (req, res) => {
  const { role, userId, notificationType } = req.query;
  const currentRole = role || req.user?.role || 'CUSTOMER';
  const currentUserId = userId || req.user?.user_id;

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .or(`recipient_role.eq.${currentRole.toUpperCase()},recipient_role.eq.ALL,user_id.eq.${currentUserId}`)
      .order('created_at', { ascending: false });

    if (notificationType && notificationType !== 'ALL') {
      query = query.eq('notification_type', notificationType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, notifications: data || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getUnreadBadgeCount = async (req, res) => {
  const { role, userId } = req.query;
  const currentRole = role || req.user?.role || 'CUSTOMER';
  const currentUserId = userId || req.user?.user_id;

  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .or(`recipient_role.eq.${currentRole.toUpperCase()},recipient_role.eq.ALL,user_id.eq.${currentUserId}`)
      .eq('is_read', false);

    if (error) throw error;

    return res.status(200).json({ success: true, unreadCount: count || 0 });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  const { role, userId } = req.body;
  const currentRole = role || req.user?.role || 'CUSTOMER';
  const currentUserId = userId || req.user?.user_id;

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .or(`recipient_role.eq.${currentRole.toUpperCase()},user_id.eq.${currentUserId}`);

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default { getNotifications, getUnreadBadgeCount, markAllNotificationsRead };