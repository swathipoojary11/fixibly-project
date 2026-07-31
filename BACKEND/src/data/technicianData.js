// const technician = {
//     id: 1,
//     name: "Rahul Sharma",
//     email: "rahul@test.com",
//     phone: "9876543210",
//     category: "Electrical",
//     availability: "Available",
//     rating: 4.8,
//     latitude: 12.9716,
//     longitude: 77.5946
// };

// const jobs = [
//     {
//         bookingId: 101,
//         customer: "Amit Kumar",
//         address: "Bangalore",
//         problem: "Fan not working",
//         status: "Assigned",
//         priority: "Normal"
//     },
//     {
//         bookingId: 102,
//         customer: "Priya",
//         address: "Mysore",
//         problem: "AC Repair",
//         status: "Assigned",
//         priority: "Emergency"
//     }
// ];

// const notifications = [
//     {
//         id: 1,
//         title: "New Job Assigned",
//         message: "Booking #101 assigned",
//         read: false
//     }
// ];

// export default {
//     technician,
//     jobs,
//     notifications
// };

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

const emergencyJobs = [
    {
        bookingId: 201,
        customer: "Ramesh",
        address: "Mangalore",
        problem: "Electrical Short Circuit",
        status: "Pending"
    }
];

const notifications = [
    {
        id: 1,
        title: "New Job Assigned",
        message: "Booking #101 assigned",
        read: false
    }
];

export default {
    technician,
    jobs,
    emergencyJobs,
    notifications
};