type AvailabilityStatus = "Available" | "Busy" | "Offline";

type JobStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";

type JobPriority = "Normal" | "Emergency";

type Technician = {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  availability: AvailabilityStatus;
  rating: number;
  latitude: number;
  longitude: number;
};

type Job = {
  bookingId: number;
  customer: string;
  address: string;
  problem: string;
  status: JobStatus;
  priority: JobPriority;
};

type EmergencyJob = {
  bookingId: number;
  customer: string;
  address: string;
  problem: string;
  status: JobStatus;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
};

// ======================================================
// 2. DATA ARRAYS (Typed with our custom types)
// ======================================================

const technician: Technician = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul@test.com",
  phone: "9876543210",
  category: "Electrical",
  availability: "Available",
  rating: 4.8,
  latitude: 12.9716,
  longitude: 77.5946
};

// Typed array: Job[] (just like Order[])
const jobs: Job[] = [
  {
    bookingId: 101,
    customer: "Amit Kumar",
    address: "Bangalore",
    problem: "Fan not working",
    status: "Assigned",
    priority: "Normal"
  },
  {
    bookingId: 102,
    customer: "Priya",
    address: "Mysore",
    problem: "AC Repair",
    status: "Assigned",
    priority: "Emergency"
  }
];

// Typed array: EmergencyJob[]
const emergencyJobs: EmergencyJob[] = [
  {
    bookingId: 201,
    customer: "Ramesh",
    address: "Mangalore",
    problem: "Electrical Short Circuit",
    status: "Pending"
  }
];

// Typed array: Notification[]
const notifications: Notification[] = [
  {
    id: 1,
    title: "New Job Assigned",
    message: "Booking #101 assigned",
    read: false
  }
];

// ======================================================
// 3. EXPORTS
// ======================================================

// Export types so services and controllers can reuse them if needed
export type { Technician, Job, EmergencyJob, Notification };

// Modern ES export of the data objects
export {
  technician,
  jobs,
  emergencyJobs,
  notifications
};

module.exports = {
    technician,
    jobs,
    emergencyJobs,
    notifications
};