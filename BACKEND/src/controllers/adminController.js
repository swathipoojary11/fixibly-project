const { supabaseAdmin } = require('../config/supabase');

const normalizeBookingStatus = (status) => {
  const value = `${status || ''}`.trim().toLowerCase();
  if (!value || ['pending', 'new', 'open'].includes(value)) return 'Pending';
  if (['accepted', 'assigned'].includes(value)) return 'Assigned';
  if (['working', 'arrived', 'in progress', 'in_progress'].includes(value)) return 'In Progress';
  if (['on the way', 'ontheway', 'on_the_way'].includes(value)) return 'On The Way';
  if (['completed', 'done'].includes(value)) return 'Completed';
  if (['cancelled', 'canceled'].includes(value)) return 'Cancelled';
  return status || 'Pending';
};

const normalizeRoleName = (role) => {
  const value = `${role || ''}`.trim().toLowerCase();
  if (!value || ['unknown', 'null'].includes(value)) return 'Unknown';
  if (['customer', 'customers'].includes(value)) return 'Customer';
  if (['dispatcher', 'dispatchers'].includes(value)) return 'Dispatcher';
  if (['technician', 'technicians'].includes(value)) return 'Technician';
  if (['admin', 'admins'].includes(value)) return 'Admin';
  return role;
};

const normalizeAvailability = (value) => {
  const availability = `${value || ''}`.trim().toLowerCase();
  if (['busy', 'working'].includes(availability)) return 'Busy';
  if (['offline', 'unavailable'].includes(availability)) return 'Offline';
  return 'Available';
};

const getRoleCounts = (users = []) => {
  const safeUsers = Array.isArray(users) ? users : [];
  const customers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Customer').length;
  const dispatchers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Dispatcher').length;
  return { customers, dispatchers };
};

// 1. Full System Overview
const getAdminDashboardOverview = async (req, res) => {
  try {
    const [
      { data: bookings, error: bErr },
      { data: technicians, error: tErr },
      { data: auditLogs, error: aErr },
      { data: notifications, error: nErr },
      { data: allUsers, error: uErr }
    ] = await Promise.all([
      supabaseAdmin.from('bookings').select('*, service_problems(problem_name), customers:users!fk_booking_customer(full_name, phone, email), technicians(rating, category_id, users(full_name, phone))').order('created_at', { ascending: false }),
      supabaseAdmin.from('technicians').select('*, users(full_name, phone, email)').order('technician_id', { ascending: true }),
      supabaseAdmin.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100),
      supabaseAdmin.from('notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabaseAdmin.from('users').select('user_id, full_name, email, phone, created_at, roles(role_name)')
    ]);

    if (bErr) throw bErr;
    if (tErr) throw tErr;
    if (uErr) throw uErr;

    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeTechnicians = Array.isArray(technicians) ? technicians : [];
    const safeUsers = Array.isArray(allUsers) ? allUsers : [];

    const customers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Customer');
    const dispatchers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Dispatcher');

    const totalPending = safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Pending').length;
    const totalAssigned = safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Assigned').length;
    const totalCompleted = safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length;
    const availableTechs = safeTechnicians.filter(t => normalizeAvailability(t.availability_status) === 'Available').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings: safeBookings.length,
        pendingBookings: totalPending,
        assignedBookings: totalAssigned,
        completedBookings: totalCompleted,
        totalTechnicians: safeTechnicians.length,
        availableTechnicians: availableTechs,
        totalUsers: safeUsers.length,
        totalCustomers: customers.length,
        totalDispatchers: dispatchers.length
      },
      bookings: safeBookings.map(b => ({ ...b, booking_status: normalizeBookingStatus(b.booking_status) })),
      technicians: safeTechnicians.map(t => ({ ...t, availability_status: normalizeAvailability(t.availability_status) })),
      customers: customers.map(u => ({ ...u, role: normalizeRoleName(u.roles?.role_name || u.role_name || u.role) })),
      dispatchers: dispatchers.map(u => ({ ...u, role: normalizeRoleName(u.roles?.role_name || u.role_name || u.role) })),
      auditLogs: auditLogs || [],
      notifications: notifications || []
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 2. Dashboard Stats Summary
const getAdminDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: bookings, error: bErr } = await supabaseAdmin.from('bookings').select('*');
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabaseAdmin.from('technicians').select('*');
    if (tErr) throw tErr;

    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeTechnicians = Array.isArray(technicians) ? technicians : [];

    const todayBookings = safeBookings.filter(b => new Date(b.created_at) >= todayStart);
    const pendingBookings = safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Pending');
    const inProgressBookings = safeBookings.filter(b => ['In Progress', 'Assigned', 'On The Way'].includes(normalizeBookingStatus(b.booking_status)));
    const completedToday = todayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed');

    const availableTechs = safeTechnicians.filter(t => normalizeAvailability(t.availability_status) === 'Available');
    const busyTechs = safeTechnicians.filter(t => normalizeAvailability(t.availability_status) === 'Busy');
    const offlineTechs = safeTechnicians.filter(t => normalizeAvailability(t.availability_status) === 'Offline');

    return res.status(200).json({
      success: true,
      summary: {
        bookingsTodayCount: todayBookings.length,
        pendingBookingsCount: pendingBookings.length,
        inProgressBookingsCount: inProgressBookings.length,
        completedTodayCount: completedToday.length,
        technicians: {
          total: technicians.length,
          available: availableTechs.length,
          busy: busyTechs.length,
          offline: offlineTechs.length
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 3. Weekly, Monthly & Lifetime Revenue Reports
const getAdminReports = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Using payments table or bookings if amount is stored there. Let's join or query payments table for accurate revenue amounts.
    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('payment_id, amount, payment_status, payment_date')
      .eq('payment_status', 'Successful');

    if (error) throw error;

    const weeklyPayments = payments.filter(p => new Date(p.payment_date) >= sevenDaysAgo);
    const monthlyPayments = payments.filter(p => new Date(p.payment_date) >= thirtyDaysAgo);

    const weeklyRevenue = weeklyPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const totalLifetimeRevenue = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return res.status(200).json({
      success: true,
      reports: {
        weekly: { successfulPaymentsCount: weeklyPayments.length, revenue: weeklyRevenue },
        monthly: { successfulPaymentsCount: monthlyPayments.length, revenue: monthlyRevenue },
        lifetime: { totalSuccessfulPayments: payments.length, totalRevenue: totalLifetimeRevenue }
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 4. Complete Dashboard Visual Analytics
const getAdminDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    startOfWeek.setHours(0,0,0,0);

    const [{ data: bookings, error: bErr }, { data: technicians, error: tErr }, { data: payments, error: pErr }] = await Promise.all([
      supabaseAdmin.from('bookings').select('*'),
      supabaseAdmin.from('technicians').select('*, users(full_name)'),
      supabaseAdmin.from('payments').select('*')
    ]);

    if (bErr) throw bErr;
    if (tErr) throw tErr;
    if (pErr) throw pErr;

    const safeBookings = Array.isArray(bookings) ? bookings : [];
    const safeTechnicians = Array.isArray(technicians) ? technicians : [];
    const safePayments = Array.isArray(payments) ? payments : [];

    const todayBookings = safeBookings.filter(b => new Date(b.created_at) >= startOfToday);
    const yesterdayBookings = safeBookings.filter(b => {
      const d = new Date(b.created_at);
      return d >= startOfYesterday && d < startOfToday;
    });

    const calcGrowth = (todayCount, yesterdayCount) => {
      if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
      return Number((((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1));
    };

    const totalBookingsToday = todayBookings.length;
    const totalBookingsTodayGrowth = calcGrowth(totalBookingsToday, yesterdayBookings.length);

    const pendingBookings = safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Pending').length;
    const inProgressJobs = safeBookings.filter(b => ['In Progress', 'Assigned', 'On The Way'].includes(normalizeBookingStatus(b.booking_status))).length;
    
    const completedJobsToday = todayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length;
    const completedJobsYesterday = yesterdayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length;
    const completedJobsGrowth = calcGrowth(completedJobsToday, completedJobsYesterday);

    const cancelledJobsToday = todayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Cancelled').length;
    const cancelledJobsYesterday = yesterdayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Cancelled').length;
    const cancelledJobsGrowth = calcGrowth(cancelledJobsToday, cancelledJobsYesterday);

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const lateJobs = safeBookings.filter(b => 
      ['Assigned', 'In Progress', 'On The Way'].includes(normalizeBookingStatus(b.booking_status)) && new Date(b.created_at) < twoHoursAgo
    ).length;

    const emergencyBookings = safeBookings.filter(b => b.emergency_flag === true && normalizeBookingStatus(b.booking_status) !== 'Completed' && normalizeBookingStatus(b.booking_status) !== 'Cancelled').length;
    const activeTechnicians = safeTechnicians.filter(t => normalizeAvailability(t.availability_status) !== 'Offline').length;

    // Calculate revenue using payments linked to today's bookings
    const todayBookingIds = new Set(todayBookings.map(b => b.booking_id));
    const expectedRevenueToday = safePayments
      .filter(p => todayBookingIds.has(p.booking_id) && p.payment_status === 'Successful')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const bookingStatusBreakdown = {
      completed: safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length,
      inProgress: inProgressJobs,
      pending: pendingBookings,
      cancelled: safeBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Cancelled').length,
      delayed: lateJobs
    };

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyTrend = dayNames.map((day, idx) => {
      const currentDay = new Date(startOfWeek.getTime() + idx * 24 * 60 * 60 * 1000);
      const nextDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);

      const dayBookings = safeBookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= currentDay && d < nextDay;
      });

      return {
        day,
        bookings: dayBookings.length,
        completed: dayBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length
      };
    });

    const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const emergencyVsNormal = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = MONTH_NAMES[targetMonthDate.getMonth()];

      const monthBookings = bookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= targetMonthDate && d < nextMonthDate;
      });

      emergencyVsNormal.push({
        month: label,
        emergency: monthBookings.filter(b => b.emergency_flag === true).length,
        normal: monthBookings.filter(b => !b.emergency_flag).length
      });
    }

    const hourlyBuckets = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
    const todaysBookingVolume = hourlyBuckets.map((bucket, index) => {
      const hourStart = 6 + index * 2;
      const bucketDateStart = new Date(startOfToday.getTime() + hourStart * 60 * 60 * 1000);
      const bucketDateEnd = new Date(bucketDateStart.getTime() + 2 * 60 * 60 * 1000);

      const count = safeBookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= bucketDateStart && d < bucketDateEnd;
      }).length;

      return { time: bucket, count };
    });

    const technicianWorkload = safeTechnicians.slice(0, 6).map(tech => {
      const techBookings = safeBookings.filter(b => b.technician_id === tech.technician_id);
      return {
        name: tech.users?.full_name || `Technician ${tech.technician_id}`,
        assigned: techBookings.filter(b => ['Assigned', 'In Progress', 'On The Way'].includes(normalizeBookingStatus(b.booking_status))).length,
        completed: techBookings.filter(b => normalizeBookingStatus(b.booking_status) === 'Completed').length
      };
    });

    // Monthly revenue + bookings trend (last 6 months)
    const monthlyRevenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mEnd   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label  = MONTH_NAMES[mStart.getMonth()];
      const mBookings = safeBookings.filter(b => { const d = new Date(b.created_at); return d >= mStart && d < mEnd; });
      const mBookingIds = new Set(mBookings.map(b => b.booking_id));
      const mRevenue = safePayments
        .filter(p => mBookingIds.has(p.booking_id) && p.payment_status === 'Successful')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      monthlyRevenueTrend.push({ month: label, revenue: mRevenue, bookings: mBookings.length });
    }

    return res.status(200).json({
      success: true,
      keyMetrics: {
        totalBookingsToday: { value: totalBookingsToday, growth: totalBookingsTodayGrowth },
        pendingBookings: { value: pendingBookings },
        inProgressJobs: { value: inProgressJobs },
        completedJobs: { value: completedJobsToday, growth: completedJobsGrowth },
        cancelledJobs: { value: cancelledJobsToday, growth: cancelledJobsGrowth },
        lateJobs: { value: lateJobs },
        emergencyBookings: { value: emergencyBookings },
        activeTechnicians: { value: activeTechnicians },
        expectedRevenueToday: { value: expectedRevenueToday }
      },
      charts: {
        bookingStatusBreakdown,
        weeklyTrend,
        emergencyVsNormal,
        todaysBookingVolume,
        technicianWorkload,
        monthlyRevenueTrend
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 5. All Users (Customers, Technicians, Dispatchers)
const getAdminUsers = async (req, res) => {
  try {
    const [{ data: allUsers, error: uErr }, { data: technicians, error: tErr }] = await Promise.all([
      supabaseAdmin.from('users').select('user_id, full_name, email, phone, created_at, role_id, roles(role_name)')
        .order('role_id', { ascending: true })
        .order('full_name', { ascending: true }),
      supabaseAdmin.from('technicians').select('technician_id, user_id, category_id, experience, rating, availability_status')
    ]);
    if (uErr) throw uErr;
    if (tErr) throw tErr;

    const safeUsers = Array.isArray(allUsers) ? allUsers : [];
    const safeTechnicians = Array.isArray(technicians) ? technicians : [];
    const techMap = {};
    safeTechnicians.forEach(t => { techMap[t.user_id] = t; });

    const customers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Customer').map(u => ({ ...u, id: u.user_id, role: 'Customer' }));
    const dispatchers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Dispatcher').map(u => ({ ...u, id: u.user_id, role: 'Dispatcher' }));
    const techUsers = safeUsers.filter(u => normalizeRoleName(u.roles?.role_name || u.role_name || u.role) === 'Technician').map(u => ({
      ...u,
      id: u.user_id,
      role: 'Technician',
      ...(techMap[u.user_id] || {})
    }));

    return res.status(200).json({
      success: true,
      counts: {
        total: safeUsers.length,
        customers: customers.length,
        technicians: techUsers.length,
        dispatchers: dispatchers.length
      },
      customers,
      technicians: techUsers,
      dispatchers
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics,
  getAdminUsers
};
