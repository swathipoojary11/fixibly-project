// src/data/bookings.js
// Replace this with API calls when backend is ready
// e.g. const bookings = await fetch('/api/bookings').then(r => r.json())

export const bookings = [
  { id: "BK-001", customer: "Arjun Mehta", phone: "9876543210", address: "12 MG Road, Bangalore", category: "Electrician", issue: "Short circuit in main panel", technicianId: "T-003", technicianName: "Ravi Kumar", status: "In Progress", priority: "High", emergency: false, createdAt: "2025-01-15T08:30:00", scheduledAt: "2025-01-15T10:00:00" },
  { id: "BK-002", customer: "Priya Sharma", phone: "9123456789", address: "45 Koramangala, Bangalore", category: "Plumber", issue: "Burst pipe in kitchen", technicianId: "T-001", technicianName: "Suresh Nair", status: "On The Way", priority: "Emergency", emergency: true, createdAt: "2025-01-15T09:00:00", scheduledAt: "2025-01-15T09:30:00" },
  { id: "BK-003", customer: "Vikram Singh", phone: "9988776655", address: "78 Indiranagar, Bangalore", category: "AC Repair", issue: "AC not cooling", technicianId: null, technicianName: null, status: "Pending", priority: "Normal", emergency: false, createdAt: "2025-01-15T09:15:00", scheduledAt: "2025-01-15T14:00:00" },
  { id: "BK-004", customer: "Anita Desai", phone: "9765432109", address: "23 Whitefield, Bangalore", category: "Carpenter", issue: "Wardrobe door broken", technicianId: "T-005", technicianName: "Mohan Das", status: "Assigned", priority: "Normal", emergency: false, createdAt: "2025-01-15T07:45:00", scheduledAt: "2025-01-15T11:00:00" },
  { id: "BK-005", customer: "Rahul Gupta", phone: "9654321098", address: "56 HSR Layout, Bangalore", category: "Painter", issue: "Full house painting", technicianId: "T-007", technicianName: "Deepak Verma", status: "Completed", priority: "Normal", emergency: false, createdAt: "2025-01-14T10:00:00", scheduledAt: "2025-01-15T08:00:00" },
  { id: "BK-006", customer: "Sunita Patel", phone: "9543210987", address: "89 JP Nagar, Bangalore", category: "Electrician", issue: "Fan installation", technicianId: "T-002", technicianName: "Anil Sharma", status: "Completed", priority: "Normal", emergency: false, createdAt: "2025-01-15T06:30:00", scheduledAt: "2025-01-15T09:00:00" },
  { id: "BK-007", customer: "Kiran Rao", phone: "9432109876", address: "34 Jayanagar, Bangalore", category: "Plumber", issue: "Bathroom tap leaking", technicianId: null, technicianName: null, status: "Cancelled", priority: "Low", emergency: false, createdAt: "2025-01-15T08:00:00", scheduledAt: "2025-01-15T12:00:00", cancelledBy: "Customer", cancelReason: "Issue resolved on own" },
  { id: "BK-008", customer: "Meera Krishnan", phone: "9321098765", address: "67 BTM Layout, Bangalore", category: "AC Repair", issue: "AC making noise", technicianId: "T-004", technicianName: "Sanjay Pillai", status: "Delayed", priority: "High", emergency: false, createdAt: "2025-01-15T07:00:00", scheduledAt: "2025-01-15T09:00:00" },
  { id: "BK-009", customer: "Arun Nair", phone: "9210987654", address: "11 Electronic City, Bangalore", category: "Electrician", issue: "Power backup installation", technicianId: "T-006", technicianName: "Rajesh Kumar", status: "In Progress", priority: "Normal", emergency: false, createdAt: "2025-01-15T08:45:00", scheduledAt: "2025-01-15T10:30:00" },
  { id: "BK-010", customer: "Divya Menon", phone: "9109876543", address: "90 Marathahalli, Bangalore", category: "Plumber", issue: "Water heater not working", technicianId: null, technicianName: null, status: "Pending", priority: "Normal", emergency: false, createdAt: "2025-01-15T09:30:00", scheduledAt: "2025-01-15T15:00:00" },
  { id: "BK-011", customer: "Suresh Babu", phone: "9098765432", address: "22 Yelahanka, Bangalore", category: "Carpenter", issue: "Kitchen cabinet repair", technicianId: "T-008", technicianName: "Prakash Reddy", status: "Assigned", priority: "Normal", emergency: false, createdAt: "2025-01-15T08:15:00", scheduledAt: "2025-01-15T13:00:00" },
  { id: "BK-012", customer: "Lakshmi Iyer", phone: "8987654321", address: "55 Bannerghatta Road, Bangalore", category: "Painter", issue: "Room painting", technicianId: null, technicianName: null, status: "Cancelled", priority: "Normal", emergency: false, createdAt: "2025-01-14T16:00:00", scheduledAt: "2025-01-15T10:00:00", cancelledBy: "Technician", cancelReason: "Personal emergency" },
];

export const emergencyBookings = [
  { id: "EM-001", customer: "Priya Sharma", phone: "9123456789", address: "45 Koramangala, Bangalore", category: "Plumber", issue: "Burst pipe flooding kitchen", emergencyLevel: "Critical", status: "Assigned", technicianId: "T-001", technicianName: "Suresh Nair", createdAt: "2025-01-15T09:00:00", broadcastSent: true },
  { id: "EM-002", customer: "Rohit Joshi", phone: "9876501234", address: "33 Sadashivanagar, Bangalore", category: "Electrician", issue: "Electrical fire risk in switchboard", emergencyLevel: "Critical", status: "Pending", technicianId: null, technicianName: null, createdAt: "2025-01-15T09:45:00", broadcastSent: false },
  { id: "EM-003", customer: "Kavitha Reddy", phone: "9765012345", address: "77 Rajajinagar, Bangalore", category: "AC Repair", issue: "No AC in 45°C heat, elderly patient", emergencyLevel: "High", status: "On The Way", technicianId: "T-004", technicianName: "Sanjay Pillai", createdAt: "2025-01-15T08:30:00", broadcastSent: true },
];

export const cancelledBookings = [
  { id: "BK-007", customer: "Kiran Rao", technicianName: "Unassigned", cancelledAt: "2025-01-15T10:30:00", cancelledBy: "Customer", reason: "Issue resolved on own", category: "Plumber" },
  { id: "BK-012", customer: "Lakshmi Iyer", technicianName: "Deepak Verma", cancelledAt: "2025-01-14T18:00:00", cancelledBy: "Technician", reason: "Personal emergency", category: "Painter" },
  { id: "BK-015", customer: "Mohan Lal", technicianName: "Anil Sharma", cancelledAt: "2025-01-14T14:00:00", cancelledBy: "Customer", reason: "Rescheduling needed", category: "Electrician" },
  { id: "BK-018", customer: "Nisha Kapoor", technicianName: "Ravi Kumar", cancelledAt: "2025-01-13T11:00:00", cancelledBy: "Technician", reason: "Vehicle breakdown", category: "Carpenter" },
];

export const bookingTimeline = [
  { stage: "Booking Assigned", time: "09:05 AM", completed: true, icon: "assign" },
  { stage: "Technician Accepted", time: "09:12 AM", completed: true, icon: "accept" },
  { stage: "Started Journey", time: "09:30 AM", completed: true, icon: "journey" },
  { stage: "Estimated Arrival", time: "10:00 AM", completed: false, icon: "eta" },
  { stage: "Reached Customer", time: "--", completed: false, icon: "arrived" },
  { stage: "Work In Progress", time: "--", completed: false, icon: "work" },
  { stage: "Completed", time: "--", completed: false, icon: "done" },
];
