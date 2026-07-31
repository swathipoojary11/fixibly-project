// src/data/activityLogs.js
// Replace with API: GET /api/activity-logs

export const activityLogs = [
  { id: "LOG-001", timestamp: "2025-01-15T09:45:00", user: "System", action: "Emergency Broadcast Triggered", detail: "Broadcast sent to 4 available plumbers for EM-001", status: "Emergency", bookingId: "EM-001" },
  { id: "LOG-002", timestamp: "2025-01-15T09:42:00", user: "Dispatcher: Kavitha", action: "Booking Assigned", detail: "BK-004 assigned to Mohan Das (Carpenter)", status: "Assigned", bookingId: "BK-004" },
  { id: "LOG-003", timestamp: "2025-01-15T09:30:00", user: "Technician: Suresh Nair", action: "Technician Accepted", detail: "Accepted emergency booking EM-001", status: "Accepted", bookingId: "EM-001" },
  { id: "LOG-004", timestamp: "2025-01-15T09:15:00", user: "Customer: Vikram Singh", action: "Booking Created", detail: "New AC Repair booking BK-003 created", status: "Created", bookingId: "BK-003" },
  { id: "LOG-005", timestamp: "2025-01-15T09:00:00", user: "Customer: Priya Sharma", action: "Booking Created", detail: "Emergency plumbing booking EM-001 created", status: "Emergency", bookingId: "EM-001" },
  { id: "LOG-006", timestamp: "2025-01-15T08:55:00", user: "Technician: Ravi Kumar", action: "Technician Started", detail: "Started journey for booking BK-001", status: "In Progress", bookingId: "BK-001" },
  { id: "LOG-007", timestamp: "2025-01-15T08:45:00", user: "Customer: Arjun Mehta", action: "Booking Created", detail: "Electrician booking BK-001 created", status: "Created", bookingId: "BK-001" },
  { id: "LOG-008", timestamp: "2025-01-15T08:30:00", user: "Technician: Deepak Verma", action: "Job Completed", detail: "Painting job BK-005 completed successfully", status: "Completed", bookingId: "BK-005" },
  { id: "LOG-009", timestamp: "2025-01-15T08:15:00", user: "Customer: Kiran Rao", action: "Booking Cancelled", detail: "BK-007 cancelled by customer - issue resolved", status: "Cancelled", bookingId: "BK-007" },
  { id: "LOG-010", timestamp: "2025-01-15T08:00:00", user: "Dispatcher: Kavitha", action: "Booking Assigned", detail: "BK-009 assigned to Rajesh Kumar (Electrician)", status: "Assigned", bookingId: "BK-009" },
  { id: "LOG-011", timestamp: "2025-01-15T07:45:00", user: "Technician: Anil Sharma", action: "Technician Arrived", detail: "Arrived at customer location for BK-006", status: "Arrived", bookingId: "BK-006" },
  { id: "LOG-012", timestamp: "2025-01-15T07:30:00", user: "System", action: "Emergency Broadcast Triggered", detail: "Broadcast sent to 3 available AC technicians for EM-003", status: "Emergency", bookingId: "EM-003" },
];
