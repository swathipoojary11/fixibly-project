const technicianData = {

  technician: {
    id: "TECH001",
    name: "Alex Carter",
    role: "Electrician",
    rating: 4.8,
    completedJobs: 152,
    status: "Available",
  },

  stats: {
    activeJobs: 1,
    completedToday: 5,
    emergencyRequests: 1,
  },

  assignedJobs: [
    {
      id: 1,
      title: "AC Repair",
      customer: "Rahul Sharma",
      address: "MG Road, Mangalore",
      time: "10:30 AM",
      status: "Scheduled",
    },
  ],

  emergencyJob: {
    id: 100,
    title: "Burst Pipe Repair",
    address: "Kadri, Mangalore",
  },

  timeline: [
    { time: "09:00", task: "Travel to AC Repair" },
    { time: "10:30", task: "AC Repair" },
    { time: "02:00", task: "Fan Installation" },
  ],
};

export default technicianData;
