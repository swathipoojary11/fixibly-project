// src/data/notifications.js
// Replace with API: GET /api/notifications?role=admin|dispatcher

export const adminNotifications = [
  { id: "N-001", type: "Emergency Alert", category: "emergency", title: "Emergency Booking Received", description: "Burst pipe reported at 45 Koramangala. Customer: Priya Sharma.", time: "2 min ago", read: false, icon: "alert" },
  { id: "N-002", type: "New Booking", category: "booking", title: "New Booking Created", description: "AC Repair booking BK-003 created by Vikram Singh.", time: "15 min ago", read: false, icon: "booking" },
  { id: "N-003", type: "Technician Delay", category: "delay", title: "Technician Delayed", description: "Sanjay Pillai is delayed for booking BK-008 by 45 minutes.", time: "30 min ago", read: false, icon: "delay" },
  { id: "N-004", type: "Cancelled Booking", category: "cancel", title: "Booking Cancelled", description: "Booking BK-007 cancelled by customer Kiran Rao.", time: "1 hr ago", read: true, icon: "cancel" },
  { id: "N-005", type: "System Announcement", category: "system", title: "System Maintenance Scheduled", description: "Scheduled maintenance on Jan 20, 2025 from 2AM–4AM.", time: "2 hr ago", read: true, icon: "system" },
  { id: "N-006", type: "New Booking", category: "booking", title: "Manual Booking Created", description: "Dispatcher created manual booking for elderly customer.", time: "3 hr ago", read: true, icon: "booking" },
  { id: "N-007", type: "Emergency Alert", category: "emergency", title: "Emergency Resolved", description: "Emergency booking EM-003 has been resolved by Sanjay Pillai.", time: "4 hr ago", read: true, icon: "alert" },
  { id: "N-008", type: "Technician Delay", category: "delay", title: "Multiple Delays Detected", description: "3 bookings are running behind schedule today.", time: "5 hr ago", read: true, icon: "delay" },
];

export const dispatcherNotifications = [
  { id: "DN-001", type: "New Booking", category: "booking", title: "New Booking Assigned", description: "Booking BK-003 needs technician assignment. Category: AC Repair.", time: "5 min ago", read: false, icon: "booking" },
  { id: "DN-002", type: "Emergency Booking", category: "emergency", title: "Emergency Job Alert", description: "CRITICAL: Electrical fire risk at 33 Sadashivanagar. Immediate action required.", time: "8 min ago", read: false, icon: "alert" },
  { id: "DN-003", type: "Technician Accepted", category: "accepted", title: "Technician Accepted Job", description: "Suresh Nair accepted booking BK-002 and is on the way.", time: "20 min ago", read: false, icon: "accept" },
  { id: "DN-004", type: "Technician Started Journey", category: "journey", title: "Technician En Route", description: "Ravi Kumar started journey for booking BK-001.", time: "35 min ago", read: true, icon: "journey" },
  { id: "DN-005", type: "Technician On the Way", category: "onway", title: "Technician On The Way", description: "Sanjay Pillai is 10 minutes away from customer location.", time: "45 min ago", read: true, icon: "onway" },
  { id: "DN-006", type: "Technician Reached Customer", category: "reached", title: "Technician Arrived", description: "Mohan Das has reached Anita Desai's location for BK-004.", time: "1 hr ago", read: true, icon: "arrived" },
  { id: "DN-007", type: "Booking Completed", category: "completed", title: "Job Completed", description: "Booking BK-005 completed successfully by Deepak Verma.", time: "2 hr ago", read: true, icon: "completed" },
  { id: "DN-008", type: "Booking Cancelled", category: "cancel", title: "Booking Cancelled", description: "Booking BK-007 cancelled by customer. Technician notified.", time: "3 hr ago", read: true, icon: "cancel" },
];
