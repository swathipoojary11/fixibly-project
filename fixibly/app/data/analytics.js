// src/data/analytics.js
// Replace with API: GET /api/analytics/dashboard

export const weeklyBookingTrend = [
  { day: "Mon", bookings: 24, completed: 20, cancelled: 2 },
  { day: "Tue", bookings: 31, completed: 27, cancelled: 3 },
  { day: "Wed", bookings: 28, completed: 24, cancelled: 2 },
  { day: "Thu", bookings: 35, completed: 30, cancelled: 4 },
  { day: "Fri", bookings: 42, completed: 36, cancelled: 3 },
  { day: "Sat", bookings: 38, completed: 33, cancelled: 2 },
  { day: "Sun", bookings: 22, completed: 19, cancelled: 1 },
];

export const monthlyRevenueTrend = [
  { month: "Aug", revenue: 48000, bookings: 120 },
  { month: "Sep", revenue: 52000, bookings: 135 },
  { month: "Oct", revenue: 61000, bookings: 158 },
  { month: "Nov", revenue: 58000, bookings: 148 },
  { month: "Dec", revenue: 72000, bookings: 182 },
  { month: "Jan", revenue: 68000, bookings: 170 },
];

export const bookingStatusDistribution = [
  { name: "Completed", value: 145, color: "#22C55E" },
  { name: "In Progress", value: 28, color: "#F97316" },
  { name: "Pending", value: 32, color: "#EAB308" },
  { name: "Cancelled", value: 18, color: "#EF4444" },
  { name: "Delayed", value: 12, color: "#8B5CF6" },
];

export const emergencyVsNormal = [
  { month: "Aug", emergency: 8, normal: 112 },
  { month: "Sep", emergency: 12, normal: 123 },
  { month: "Oct", emergency: 10, normal: 148 },
  { month: "Nov", emergency: 15, normal: 133 },
  { month: "Dec", emergency: 18, normal: 164 },
  { month: "Jan", emergency: 14, normal: 156 },
];

export const technicianWorkload = [
  { name: "Suresh N.", jobs: 18, completed: 16 },
  { name: "Anil S.", jobs: 22, completed: 21 },
  { name: "Ravi K.", jobs: 15, completed: 12 },
  { name: "Sanjay P.", jobs: 20, completed: 17 },
  { name: "Mohan D.", jobs: 12, completed: 11 },
  { name: "Rajesh K.", jobs: 25, completed: 23 },
];

export const dailyBookingVolume = [
  { hour: "6AM", bookings: 2 },
  { hour: "7AM", bookings: 5 },
  { hour: "8AM", bookings: 12 },
  { hour: "9AM", bookings: 18 },
  { hour: "10AM", bookings: 22 },
  { hour: "11AM", bookings: 19 },
  { hour: "12PM", bookings: 15 },
  { hour: "1PM", bookings: 10 },
  { hour: "2PM", bookings: 14 },
  { hour: "3PM", bookings: 17 },
  { hour: "4PM", bookings: 20 },
  { hour: "5PM", bookings: 16 },
  { hour: "6PM", bookings: 8 },
];

export const kpiStats = {
  totalBookingsToday: 42,
  pendingBookings: 12,
  inProgressJobs: 8,
  completedJobs: 18,
  cancelledJobs: 3,
  lateJobs: 4,
  emergencyBookings: 2,
  activeTechnicians: 7,
  expectedRevenueToday: 18500,
  expectedRevenueWeek: 98000,
  expectedRevenueMonth: 380000,
  avgBookingValue: 1850,
  monthlyGrowth: 12.5,
};

export const dispatcherStats = {
  pendingBookings: 12,
  availableTechnicians: 4,
  busyTechnicians: 6,
  emergencyJobs: 2,
  cancelledToday: 3,
};
