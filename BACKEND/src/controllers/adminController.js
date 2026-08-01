import supabase from '../config/supabase.js';
import { logAuditEvent } from '../services/auditService.js';

// 1. Overview
export const getAdminDashboardOverview = async (req, res) => {
  try {
    const { data: bookings, error: bErr } = await supabase
      .from('bookings')
      .select('*, service_categories(category_name), users!fk_booking_customer(full_name, email, phone)')
      .order('created_at', { ascending: false });
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabase
      .from('technicians')
      .select('*, service_categories(category_name), users(full_name, email, phone, is_active)');
    if (tErr) throw tErr;

    const { data: activityLogs } = await supabase
      .from('activity_logs')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    const totalPending = (bookings || []).filter(b => b.booking_status === 'Pending').length;
    const totalAssigned = (bookings || []).filter(b => b.booking_status === 'Assigned' || b.booking_status === 'Accepted' || b.booking_status === 'Working').length;
    const totalCompleted = (bookings || []).filter(b => b.booking_status === 'Completed').length;
    const availableTechs = (technicians || []).filter(t => t.availability_status === 'Available').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings: (bookings || []).length,
        pendingBookings: totalPending,
        assignedBookings: totalAssigned,
        completedBookings: totalCompleted,
        totalTechnicians: (technicians || []).length,
        availableTechnicians: availableTechs
      },
      bookings: bookings || [],
      technicians: technicians || [],
      auditLogs: activityLogs || [],
      notifications: notifications || []
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: bookings } = await supabase.from('bookings').select('*');
    const { data: technicians } = await supabase.from('technicians').select('*');

    const todayBookings = (bookings || []).filter(b => new Date(b.created_at) >= todayStart);
    const pendingBookings = (bookings || []).filter(b => b.booking_status === 'Pending');
    const inProgressBookings = (bookings || []).filter(b => ['Assigned', 'Accepted', 'On The Way', 'Arrived', 'Working', 'Waiting for Customer Confirmation'].includes(b.booking_status));
    const completedToday = todayBookings.filter(b => b.booking_status === 'Completed');

    const availableTechs = (technicians || []).filter(t => t.availability_status === 'Available');
    const busyTechs = (technicians || []).filter(t => t.availability_status === 'Busy');
    const offlineTechs = (technicians || []).filter(t => t.availability_status === 'Offline');

    return res.status(200).json({
      success: true,
      summary: {
        bookingsTodayCount: todayBookings.length,
        pendingBookingsCount: pendingBookings.length,
        inProgressBookingsCount: inProgressBookings.length,
        completedTodayCount: completedToday.length,
        technicians: {
          total: (technicians || []).length,
          available: availableTechs.length,
          busy: busyTechs.length,
          offline: offlineTechs.length
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Reports
export const getAdminReports = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, service_problems(fixed_price)')
      .eq('booking_status', 'Completed');

    const list = bookings || [];

    const getAmount = (b) => Number(b.final_amount || b.estimated_amount || b.service_problems?.fixed_price || 400);

    const weeklyBookings = list.filter(b => new Date(b.created_at) >= sevenDaysAgo);
    const monthlyBookings = list.filter(b => new Date(b.created_at) >= thirtyDaysAgo);

    const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + getAmount(b), 0);
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + getAmount(b), 0);
    const totalLifetimeRevenue = list.reduce((sum, b) => sum + getAmount(b), 0);

    return res.status(200).json({
      success: true,
      reports: {
        weekly: { completedJobs: weeklyBookings.length, revenue: weeklyRevenue },
        monthly: { completedJobs: monthlyBookings.length, revenue: monthlyRevenue },
        lifetime: { totalCompletedJobs: list.length, totalRevenue: totalLifetimeRevenue }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Analytics Charts Data
export const getAdminDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0,0,0,0);

    const [{ data: bookings }, { data: technicians }] = await Promise.all([
      supabase.from('bookings').select('*, service_problems(fixed_price)'),
      supabase.from('technicians').select('*, users(full_name)')
    ]);

    const bList = bookings || [];
    const tList = technicians || [];

    const todayBookings = bList.filter(b => new Date(b.created_at) >= startOfToday);
    const yesterdayBookings = bList.filter(b => {
      const d = new Date(b.created_at);
      return d >= startOfYesterday && d < startOfToday;
    });

    const calcGrowth = (today, yesterday) => {
      if (yesterday === 0) return today > 0 ? 100 : 0;
      return Number((((today - yesterday) / yesterday) * 100).toFixed(1));
    };

    const bookingStatusBreakdown = {
      completed: bList.filter(b => b.booking_status === 'Completed').length,
      inProgress: bList.filter(b => ['Assigned', 'Accepted', 'On The Way', 'Arrived', 'Working', 'Waiting for Customer Confirmation'].includes(b.booking_status)).length,
      pending: bList.filter(b => b.booking_status === 'Pending').length,
      cancelled: bList.filter(b => b.booking_status === 'Cancelled').length
    };

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyTrend = dayNames.map((day, idx) => {
      const currentDay = new Date(startOfWeek.getTime() + idx * 24 * 60 * 60 * 1000);
      const nextDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);
      const dayBookings = bList.filter(b => {
        const d = new Date(b.created_at);
        return d >= currentDay && d < nextDay;
      });
      return {
        day,
        bookings: dayBookings.length,
        completed: dayBookings.filter(b => b.booking_status === 'Completed').length
      };
    });

    const technicianWorkload = tList.slice(0, 6).map(tech => {
      const techBookings = bList.filter(b => b.technician_id === tech.technician_id);
      return {
        name: tech.users?.full_name || `Tech #${tech.technician_id}`,
        assigned: techBookings.filter(b => ['Assigned', 'Accepted', 'Working'].includes(b.booking_status)).length,
        completed: techBookings.filter(b => b.booking_status === 'Completed').length
      };
    });

    return res.status(200).json({
      success: true,
      keyMetrics: {
        totalBookingsToday: { value: todayBookings.length, growth: calcGrowth(todayBookings.length, yesterdayBookings.length) },
        pendingBookings: { value: bookingStatusBreakdown.pending },
        inProgressJobs: { value: bookingStatusBreakdown.inProgress },
        completedJobs: { value: bookingStatusBreakdown.completed },
        cancelledJobs: { value: bookingStatusBreakdown.cancelled },
        emergencyBookings: { value: bList.filter(b => b.emergency_flag).length },
        activeTechnicians: { value: tList.filter(t => t.availability_status !== 'Offline').length }
      },
      charts: {
        bookingStatusBreakdown,
        weeklyTrend,
        technicianWorkload
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 5. User Management (Customers, Technicians, Dispatchers, Admins)
export const getUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('user_id, full_name, email, phone, address, role_id, is_active, created_at, roles(role_name)')
      .order('user_id', { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Toggle User Active/Deactive Status
export const toggleUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { is_active } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select('user_id, full_name, email, is_active')
      .single();

    if (error) throw error;

    await logAuditEvent(
      req.user?.user_id,
      'Admin',
      'User Account Change',
      `Admin toggled User #${userId} (${user.full_name}) active status to ${is_active}`
    );

    return res.status(200).json({
      success: true,
      message: `User account ${is_active ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// 7. Activity Logs
export const getActivityLogs = async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return res.status(200).json({ success: true, logs: logs || [] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics,
  getUsers,
  toggleUserStatus,
  getActivityLogs
};