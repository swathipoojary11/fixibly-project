import data from "../data/technicianData.js";

export const getProfile = () => data.technician;

export const getJobs = () => data.jobs;

export const getEmergencyJobs = () => data.emergencyJobs;

export const getNotifications = () => data.notifications;

export const updateAvailability = (status) => {
    data.technician.availability = status;
    return data.technician;
};

export const updateLocation = (lat, lng) => {
    data.technician.latitude = lat;
    data.technician.longitude = lng;
    return data.technician;
};

export const updateJobStatus = (bookingId, status) => {
    const job = data.jobs.find(
        j => j.bookingId == bookingId
    );

    if (!job) return null;

    job.status = status;

    return job;
};

export const acceptJob = (bookingId) => {

    const job = data.jobs.find(
        j => j.bookingId == bookingId
    );

    if (!job) return null;

    job.status = "Accepted";

    data.technician.availability = "Busy";

    return job;
};

export const rejectJob = (bookingId) => {

    const job = data.jobs.find(
        j => j.bookingId == bookingId
    );

    if (!job) return null;

    job.status = "Rejected";

    data.technician.availability = "Available";

    return job;
};

export const acceptEmergency = (bookingId) => {

    const job = data.emergencyJobs.find(
        j => j.bookingId == bookingId
    );

    if (!job) return null;

    job.status = "Accepted";

    data.technician.availability = "Busy";

    return job;
};

export const markNotificationRead = (id) => {

    const notification = data.notifications.find(
        n => n.id == id
    );

    if (!notification) return null;

    notification.read = true;

    return notification;
};