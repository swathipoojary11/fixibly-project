// const { supabaseAdmin } = require('../config/supabase');

// const buildNotifFilter = (role, userId) => {
//   const parts = [];
//   if (role) parts.push(`recipient_role.eq.${role}`, `recipient_role.eq.ALL`);
//   if (userId) parts.push(`user_id.eq.${userId}`);
//   return parts.join(',');
// };

// const getNotifications = async (req, res) => {
//   const { role, userId, notificationType } = req.query;

//   if (!role && !userId) {
//     return res.status(400).json({ error: 'role or userId is required' });
//   }

//   try {
//     let query = supabaseAdmin
//       .from('notifications')
//       .select('*')
//       .or(buildNotifFilter(role, userId))
//       .order('created_at', { ascending: false })
//       .limit(100);

//     if (notificationType && notificationType !== 'ALL') {
//       query = query.eq('notification_type', notificationType);
//     }

//     // Role-based filtering for notification types
//     if (role === 'TECHNICIAN') {
//       query = query.in('notification_type', ['Emergency', 'Assignment']);
//     } else if (role === 'CUSTOMER') {
//       query = query.in('notification_type', ['Booking', 'Assignment', 'Cancellation']);
//     }

//     const { data, error } = await query;
//     if (error) throw error;

//     return res.status(200).json({ success: true, notifications: data });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// const getUnreadBadgeCount = async (req, res) => {
//   const { role, userId } = req.query;

//   if (!role && !userId) {
//     return res.status(400).json({ error: 'role or userId is required' });
//   }

//   try {
//     const { count, error } = await supabaseAdmin
//       .from('notifications')
//       .select('*', { count: 'exact', head: true })
//       .or(buildNotifFilter(role, userId))
//       .eq('is_read', false);

//     if (error) throw error;

//     return res.status(200).json({ unreadCount: count || 0 });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// const markAllNotificationsRead = async (req, res) => {
//   const { role, userId } = req.body;

//   if (!role && !userId) {
//     return res.status(400).json({ error: 'role or userId is required' });
//   }

//   try {
//     const { error } = await supabaseAdmin
//       .from('notifications')
//       .update({ is_read: true })
//       .or(buildNotifFilter(role, userId));

//     if (error) throw error;

//     return res.status(200).json({ success: true, message: 'All notifications marked as read' });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { getNotifications, getUnreadBadgeCount, markAllNotificationsRead };











const { supabaseAdmin } = require('../config/supabase');

const buildNotifFilter = (role, userId) => {
  const parts = [];
  parts.push(`recipient_role.eq.ALL`); // broadcast-to-everyone notifications
  if (role && userId) {
    parts.push(`and(recipient_role.eq.${role},user_id.eq.${userId})`);
  } else if (role) {
    parts.push(`recipient_role.eq.${role}`); // fallback: role-only queries (e.g. dispatcher/admin dashboards with no specific user)
  } else if (userId) {
    parts.push(`user_id.eq.${userId}`);
  }
  return parts.join(',');
};

const getNotifications = async (req, res) => {
  const { role, userId, notificationType } = req.query;

  if (!role && !userId) {
    return res.status(400).json({ error: 'role or userId is required' });
  }

  try {
    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .or(buildNotifFilter(role, userId))
      .order('created_at', { ascending: false })
      .limit(100);

    if (notificationType && notificationType !== 'ALL') {
      query = query.eq('notification_type', notificationType);
    }

    // Role-based filtering for notification types
    if (role === 'TECHNICIAN') {
      query = query.in('notification_type', ['Emergency', 'Assignment']);
    } else if (role === 'CUSTOMER') {
      // Customers only see technician assignment details, not every status update
      query = query.eq('notification_type', 'Assignment');
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

  if (!role && !userId) {
    return res.status(400).json({ error: 'role or userId is required' });
  }

  try {
    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .or(buildNotifFilter(role, userId))
      .eq('is_read', false);

    if (error) throw error;

    return res.status(200).json({ unreadCount: count || 0 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const markAllNotificationsRead = async (req, res) => {
  const { role, userId } = req.body;

  if (!role && !userId) {
    return res.status(400).json({ error: 'role or userId is required' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .or(buildNotifFilter(role, userId));

    if (error) throw error;

    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, getUnreadBadgeCount, markAllNotificationsRead };