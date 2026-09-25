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

module.exports = {
  normalizeBookingStatus,
  normalizeRoleName,
  normalizeAvailability
};
