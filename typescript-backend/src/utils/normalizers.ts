export type BookingStatus =
  | "Pending"
  | "Assigned"
  | "In Progress"
  | "On The Way"
  | "Completed"
  | "Cancelled"
  | string;

export type RoleName =
  | "Customer"
  | "Dispatcher"
  | "Technician"
  | "Admin"
  | "Unknown"
  | string;

export type AvailabilityStatus = "Available" | "Busy" | "Offline" | string;

export const normalizeBookingStatus = (status?: string | null): BookingStatus => {
  const value = `${status || ""}`.trim().toLowerCase();
  if (!value || ["pending", "new", "open"].includes(value)) return "Pending";
  if (["accepted", "assigned"].includes(value)) return "Assigned";
  if (["working", "arrived", "in progress", "in_progress"].includes(value))
    return "In Progress";
  if (["on the way", "ontheway", "on_the_way"].includes(value))
    return "On The Way";
  if (["completed", "done"].includes(value)) return "Completed";
  if (["cancelled", "canceled"].includes(value)) return "Cancelled";
  return status || "Pending";
};

export const normalizeRoleName = (role?: string | null): RoleName => {
  const value = `${role || ""}`.trim().toLowerCase();
  if (!value || ["unknown", "null"].includes(value)) return "Unknown";
  if (["customer", "customers"].includes(value)) return "Customer";
  if (["dispatcher", "dispatchers"].includes(value)) return "Dispatcher";
  if (["technician", "technicians"].includes(value)) return "Technician";
  if (["admin", "admins"].includes(value)) return "Admin";
  return role || "Unknown";
};

export const normalizeAvailability = (value?: string | null): AvailabilityStatus => {
  const availability = `${value || ""}`.trim().toLowerCase();
  if (["busy", "working"].includes(availability)) return "Busy";
  if (["offline", "unavailable"].includes(availability)) return "Offline";
  return "Available";
};

export default {
  normalizeBookingStatus,
  normalizeRoleName,
  normalizeAvailability
};