const data = require("../data/technicianData.js");

const getProfile = () => data.technician;
const getJobs = () => data.jobs;
const getEmergencyJobs = () => data.emergencyJobs;
const getNotifications = () => data.notifications;

const updateAvailability = (status) => {
    data.technician.availability = status;
    return data.technician;
};

const updateLocation = (lat, lng) => {
    data.technician.latitude = lat;
    data.technician.longitude = lng;
    return data.technician;
};

const updateJobStatus = (bookingId, status) => {
    const job = data.jobs.find(j => j.bookingId == bookingId);
    if (!job) return null;
    job.status = status;
    return job;
};

const acceptJob = (bookingId) => {
    const job = data.jobs.find(j => j.bookingId == bookingId);
    if (!job) return null;
    job.status = "Accepted";
    data.technician.availability = "Busy";
    return job;
};

const rejectJob = (bookingId) => {
    const job = data.jobs.find(j => j.bookingId == bookingId);
    if (!job) return null;
    job.status = "Rejected";
    data.technician.availability = "Available";
    return job;
};

const acceptEmergency = (bookingId) => {
    const job = data.emergencyJobs.find(j => j.bookingId == bookingId);
    if (!job) return null;
    job.status = "Accepted";
    data.technician.availability = "Busy";
    return job;
};

const markNotificationRead = (id) => {
    const notification = data.notifications.find(n => n.id == id);
    if (!notification) return null;
    notification.read = true;
    return notification;
};

module.exports = {
    getProfile,
    getJobs,
    getEmergencyJobs,
    getNotifications,
    updateAvailability,
    updateLocation,
    updateJobStatus,
    acceptJob,
    rejectJob,
    acceptEmergency,
    markNotificationRead
};