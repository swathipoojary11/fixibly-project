// src/data/users.js
// Replace with API: GET /api/users?role=customer|technician|dispatcher

export const customers = [
  { id: "C-001", name: "Arjun Mehta", email: "arjun@email.com", phone: "9876543210", role: "Customer", status: "Active", joinedDate: "2024-08-15", totalBookings: 5 },
  { id: "C-002", name: "Priya Sharma", email: "priya@email.com", phone: "9123456789", role: "Customer", status: "Active", joinedDate: "2024-09-01", totalBookings: 3 },
  { id: "C-003", name: "Vikram Singh", email: "vikram@email.com", phone: "9988776655", role: "Customer", status: "Active", joinedDate: "2024-07-20", totalBookings: 8 },
  { id: "C-004", name: "Anita Desai", email: "anita@email.com", phone: "9765432109", role: "Customer", status: "Inactive", joinedDate: "2024-06-10", totalBookings: 2 },
  { id: "C-005", name: "Rahul Gupta", email: "rahul@email.com", phone: "9654321098", role: "Customer", status: "Active", joinedDate: "2024-10-05", totalBookings: 12 },
  { id: "C-006", name: "Sunita Patel", email: "sunita@email.com", phone: "9543210987", role: "Customer", status: "Active", joinedDate: "2024-11-12", totalBookings: 4 },
  { id: "C-007", name: "Kiran Rao", email: "kiran@email.com", phone: "9432109876", role: "Customer", status: "Active", joinedDate: "2024-12-01", totalBookings: 1 },
  { id: "C-008", name: "Meera Krishnan", email: "meera@email.com", phone: "9321098765", role: "Customer", status: "Active", joinedDate: "2025-01-03", totalBookings: 6 },
];

export const technicianUsers = [
  { id: "T-001", name: "Suresh Nair", email: "suresh@fieldflow.in", phone: "9876543201", role: "Technician", status: "Active", joinedDate: "2024-03-15", category: "Plumber" },
  { id: "T-002", name: "Anil Sharma", email: "anil@fieldflow.in", phone: "9876543202", role: "Technician", status: "Active", joinedDate: "2024-01-10", category: "Electrician" },
  { id: "T-003", name: "Ravi Kumar", email: "ravi@fieldflow.in", phone: "9876543203", role: "Technician", status: "Active", joinedDate: "2024-05-20", category: "Electrician" },
  { id: "T-004", name: "Sanjay Pillai", email: "sanjay@fieldflow.in", phone: "9876543204", role: "Technician", status: "Active", joinedDate: "2024-02-28", category: "AC Repair" },
  { id: "T-005", name: "Mohan Das", email: "mohan@fieldflow.in", phone: "9876543205", role: "Technician", status: "Active", joinedDate: "2024-04-12", category: "Carpenter" },
  { id: "T-006", name: "Rajesh Kumar", email: "rajesh@fieldflow.in", phone: "9876543206", role: "Technician", status: "Active", joinedDate: "2023-11-05", category: "Electrician" },
  { id: "T-007", name: "Deepak Verma", email: "deepak@fieldflow.in", phone: "9876543207", role: "Technician", status: "Active", joinedDate: "2024-06-01", category: "Painter" },
  { id: "T-008", name: "Prakash Reddy", email: "prakash@fieldflow.in", phone: "9876543208", role: "Technician", status: "Active", joinedDate: "2024-07-15", category: "Carpenter" },
  { id: "T-009", name: "Vijay Menon", email: "vijay@fieldflow.in", phone: "9876543209", role: "Technician", status: "Active", joinedDate: "2024-03-01", category: "Plumber" },
  { id: "T-010", name: "Arjun Patel", email: "arjun@fieldflow.in", phone: "9876543210", role: "Technician", status: "Inactive", joinedDate: "2024-04-20", category: "AC Repair" },
];

export const dispatchers = [
  { id: "D-001", name: "Kavitha Reddy", email: "kavitha@fieldflow.in", phone: "9111222333", role: "Dispatcher", status: "Active", joinedDate: "2024-01-05", shift: "Morning" },
  { id: "D-002", name: "Ramesh Iyer", email: "ramesh@fieldflow.in", phone: "9222333444", role: "Dispatcher", status: "Active", joinedDate: "2024-02-10", shift: "Evening" },
  { id: "D-003", name: "Pooja Nair", email: "pooja@fieldflow.in", phone: "9333444555", role: "Dispatcher", status: "Inactive", joinedDate: "2024-03-20", shift: "Night" },
];
