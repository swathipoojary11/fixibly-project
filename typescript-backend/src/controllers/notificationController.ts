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









import { Request, Response } from 'express';

// Safe require for Supabase admin client
const { supabaseAdmin } = require('../config/supabase');


type IdType = string | number;

type RecipientRole = 'TECHNICIAN' | 'CUSTOMER' | 'DISPATCHER' | 'ADMIN' | 'ALL' | string;

// Query parameters for GET /notifications
type NotificationQueryParams = {
  role?: RecipientRole;
  userId?: IdType;
  notificationType?: string;
};

// Body parameters for POST /notifications/read-all
type MarkReadBody = {
  role?: RecipientRole;
  userId?: IdType;
};

// Error interface for catch blocks
type CustomError = {
  message?: string;
};

// Generic DB record helper
type DbRecord = Record<string, any>;


const buildNotifFilter = (role?: RecipientRole, userId?: IdType): string => {
  const parts: string[] = [];
  parts.push(`recipient_role.eq.ALL`); // broadcast-to-everyone notifications

  if (role && userId) {
    parts.push(`and(recipient_role.eq.${role},user_id.eq.${userId})`);
  } else if (role) {
    parts.push(`recipient_role.eq.${role}`); // fallback: role-only queries
  } else if (userId) {
    parts.push(`user_id.eq.${userId}`);
  }

  return parts.join(',');
};
// 1. Fetch Notifications with joined booking issue descriptions
export const getNotifications = async (req: Request, res: Response) => {
  const { role, userId, notificationType } = req.query as NotificationQueryParams;

  if (!role && !userId) {
    return res.status(400).json({ error: 'role or userId is required' });
  }

  try {
    let query = supabaseAdmin
      .from('notifications')
      .select('*, bookings(issue_description, service_problems(problem_name))')
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
      // Customers only see technician assignment details
      query = query.eq('notification_type', 'Assignment');
    }

    const { data, error } = await query;
    if (error) throw error;

    const rawList: DbRecord[] = data || [];

    const notifications = rawList.map((notification: DbRecord) => ({
      ...notification,
      issue:
        notification.bookings?.service_problems?.problem_name ||
        notification.bookings?.issue_description ||
        null
    }));

    return res.status(200).json({ success: true, notifications });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 2. Fetch Unread Badge Count
export const getUnreadBadgeCount = async (req: Request, res: Response) => {
  const { role, userId } = req.query as NotificationQueryParams;

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
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// 3. Mark All Filtered Notifications as Read
export const markAllNotificationsRead = async (req: Request, res: Response) => {
  const { role, userId } = req.body as MarkReadBody;

  if (!role && !userId) {
    return res.status(400).json({ error: 'role or userId is required' });
  }

  try {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .or(buildNotifFilter(role, userId));

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

module.exports = { getNotifications, getUnreadBadgeCount, markAllNotificationsRead };
