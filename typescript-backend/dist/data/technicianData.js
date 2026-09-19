"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = exports.emergencyJobs = exports.jobs = exports.technician = void 0;
// ======================================================
// 2. DATA ARRAYS (Typed with our custom types)
// ======================================================
const technician = {
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
exports.technician = technician;
// Typed array: Job[] (just like Order[])
const jobs = [
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
exports.jobs = jobs;
// Typed array: EmergencyJob[]
const emergencyJobs = [
    {
        bookingId: 201,
        customer: "Ramesh",
        address: "Mangalore",
        problem: "Electrical Short Circuit",
        status: "Pending"
    }
];
exports.emergencyJobs = emergencyJobs;
// Typed array: Notification[]
const notifications = [
    {
        id: 1,
        title: "New Job Assigned",
        message: "Booking #101 assigned",
        read: false
    }
];
exports.notifications = notifications;
module.exports = {
    technician,
    jobs,
    emergencyJobs,
    notifications
};
//# sourceMappingURL=technicianData.js.map