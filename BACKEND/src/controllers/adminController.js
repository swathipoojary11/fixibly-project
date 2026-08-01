const { supabaseAdmin } = require('../config/supabase');

// 1. Full System Overview
const getAdminDashboardOverview = async (req, res) => {
  try {
    const { data: bookings, error: bErr } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (bErr) throw bErr;

    const { data: technicians, error: tErr } = await supabaseAdmin
      .from('technicians')
      .select('*');
    if (tErr) throw tErr;

    const { data: auditLogs, error: aErr } = await supabaseAdmin
      .from('system_audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (aErr) throw aErr;

    const { data: notifications, error: nErr } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (nErr) throw nErr;

    const totalPending = bookings.filter(b => b.booking_status === 'PENDING').length;
    const totalAssigned = bookings.filter(b => b.booking_status === 'ASSIGNED').length;
    const totalCompleted = bookings.filter(b => b.booking_status === 'COMPLETED').length;
    const availableTechs = technicians.filter(t => t.availability_status === 'AVAILABLE').length;

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings: bookings.length,
        pendingBookings: totalPending,
        assignedBookings: totalAssigned,
        completedBookings: totalCompleted,
        totalTechnicians: technicians.length,
        availableTechnicians: availableTechs
      },
      bookings,
      technicians,
      auditLogs,
      notifications
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

    const todayBookings = bookings.filter(b => new Date(b.created_at) >= todayStart);
    const pendingBookings = bookings.filter(b => b.booking_status === 'PENDING');
    const inProgressBookings = bookings.filter(b => b.booking_status === 'IN_PROGRESS' || b.booking_status === 'ASSIGNED');
    const completedToday = todayBookings.filter(b => b.booking_status === 'COMPLETED');

    const availableTechs = technicians.filter(t => t.availability_status === 'AVAILABLE');
    const busyTechs = technicians.filter(t => t.availability_status === 'BUSY');
    const offlineTechs = technicians.filter(t => t.availability_status === 'OFFLINE');

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

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('booking_id, booking_status, total_amount, created_at')
      .eq('booking_status', 'COMPLETED');

    if (error) throw error;

    const weeklyBookings = bookings.filter(b => new Date(b.created_at) >= sevenDaysAgo);
    const monthlyBookings = bookings.filter(b => new Date(b.created_at) >= thirtyDaysAgo);

    const weeklyRevenue = weeklyBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);
    const totalLifetimeRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

    return res.status(200).json({
      success: true,
      reports: {
        weekly: { completedJobs: weeklyBookings.length, revenue: weeklyRevenue },
        monthly: { completedJobs: monthlyBookings.length, revenue: monthlyRevenue },
        lifetime: { totalCompletedJobs: bookings.length, totalRevenue: totalLifetimeRevenue }
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// 4. Complete Dashboard Visual Analytics (Feeds image_5a9733.png UI)
const getAdminDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    
    // Time boundaries
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday
    startOfWeek.setHours(0,0,0,0);

    // Fetch data in parallel
    const [{ data: bookings, error: bErr }, { data: technicians, error: tErr }] = await Promise.all([
      supabaseAdmin.from('bookings').select('*, technicians(name)'),
      supabaseAdmin.from('technicians').select('technician_id, name, availability_status')
    ]);

    if (bErr) throw bErr;
    if (tErr) throw tErr;

    // A. KEY METRICS & COMPARISONS FOR TOP CARDS
    const todayBookings = bookings.filter(b => new Date(b.created_at) >= startOfToday);
    const yesterdayBookings = bookings.filter(b => {
      const d = new Date(b.created_at);
      return d >= startOfYesterday && d < startOfToday;
    });

    // Helper function to compute percentage growth safely
    const calcGrowth = (todayCount, yesterdayCount) => {
      if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
      return Number((((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1));
    };

    // Card Metrics
    const totalBookingsToday = todayBookings.length;
    const totalBookingsTodayGrowth = calcGrowth(totalBookingsToday, yesterdayBookings.length);

    const pendingBookings = bookings.filter(b => b.booking_status === 'PENDING').length;
    const inProgressJobs = bookings.filter(b => ['IN_PROGRESS', 'ASSIGNED'].includes(b.booking_status)).length;
    
    const completedJobsToday = todayBookings.filter(b => b.booking_status === 'COMPLETED').length;
    const completedJobsYesterday = yesterdayBookings.filter(b => b.booking_status === 'COMPLETED').length;
    const completedJobsGrowth = calcGrowth(completedJobsToday, completedJobsYesterday);

    const cancelledJobsToday = todayBookings.filter(b => b.booking_status === 'CANCELLED').length;
    const cancelledJobsYesterday = yesterdayBookings.filter(b => b.booking_status === 'CANCELLED').length;
    const cancelledJobsGrowth = calcGrowth(cancelledJobsToday, cancelledJobsYesterday);

    // Late / Delayed Jobs (Assigned/In-Progress over 2 hours ago)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const lateJobs = bookings.filter(b => 
      ['ASSIGNED', 'IN_PROGRESS'].includes(b.booking_status) && new Date(b.created_at) < twoHoursAgo
    ).length;

    const emergencyBookings = bookings.filter(b => b.emergency_flag === true && b.booking_status !== 'COMPLETED').length;
    const activeTechnicians = technicians.filter(t => t.availability_status !== 'OFFLINE').length;

    const expectedRevenueToday = todayBookings.reduce((sum, b) => sum + (Number(b.total_amount || b.price || 0)), 0);

    // B. BOOKING STATUS DONUT CHART
    const bookingStatusBreakdown = {
      completed: bookings.filter(b => b.booking_status === 'COMPLETED').length,
      inProgress: inProgressJobs,
      pending: pendingBookings,
      cancelled: bookings.filter(b => b.booking_status === 'CANCELLED').length,
      delayed: lateJobs
    };

    // C. WEEKLY BOOKING TREND (Mon - Sun)
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyTrend = dayNames.map((day, idx) => {
      const currentDay = new Date(startOfWeek.getTime() + idx * 24 * 60 * 60 * 1000);
      const nextDay = new Date(currentDay.getTime() + 24 * 60 * 60 * 1000);

      const dayBookings = bookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= currentDay && d < nextDay;
      });

      return {
        day,
        bookings: dayBookings.length,
        completed: dayBookings.filter(b => b.booking_status === 'COMPLETED').length
      };
    });

    // D. EMERGENCY VS NORMAL JOBS (Last 6 Months)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const emergencyVsNormal = [];
    for (let i = 5; i >= 0; i--) {
      const targetMonthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = monthNames[targetMonthDate.getMonth()];

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

    // E. TODAY'S BOOKING VOLUME (Hourly Distribution: 6AM - 6PM)
    const hourlyBuckets = ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM'];
    const todaysBookingVolume = hourlyBuckets.map((bucket, index) => {
      const hourStart = 6 + index * 2;
      const bucketDateStart = new Date(startOfToday.getTime() + hourStart * 60 * 60 * 1000);
      const bucketDateEnd = new Date(bucketDateStart.getTime() + 2 * 60 * 60 * 1000);

      const count = bookings.filter(b => {
        const d = new Date(b.created_at);
        return d >= bucketDateStart && d < bucketDateEnd;
      }).length;

      return { time: bucket, count };
    });

    // F. TECHNICIAN WORKLOAD CHART
    const technicianWorkload = technicians.slice(0, 6).map(tech => {
      const techBookings = bookings.filter(b => b.technician_id === tech.technician_id);
      return {
        name: tech.name,
        assigned: techBookings.filter(b => ['ASSIGNED', 'IN_PROGRESS'].includes(b.booking_status)).length,
        completed: techBookings.filter(b => b.booking_status === 'COMPLETED').length
      };
    });

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
        technicianWorkload
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAdminDashboardOverview,
  getAdminDashboardStats,
  getAdminReports,
  getAdminDashboardAnalytics
};