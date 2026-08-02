const technicianService = require("../services/technicianService.js");

const profile = (req, res) => {
    res.json({
        success: true,
        data: technicianService.getProfile()
    });
};

const jobs = (req, res) => {
    res.json({
        success: true,
        data: technicianService.getJobs()
    });
};

const availability = (req, res) => {
    const { status } = req.body;
    res.json({
        success: true,
        data: technicianService.updateAvailability(status)
    });
};

const location = (req, res) => {
    const { latitude, longitude } = req.body;
    res.json({
        success: true,
        data: technicianService.updateLocation(latitude, longitude)
    });
};

const jobStatus = (req, res) => {
    const job = technicianService.updateJobStatus(
        req.params.id,
        req.body.status
    );
    if (!job)
        return res.status(404).json({
            message: "Job not found"
        });
    res.json({
        success: true,
        data: job
    });
};

const accept = (req, res) => {
    const job = technicianService.acceptJob(req.params.id);
    if (!job)
        return res.status(404).json({
            message: "Job not found"
        });
    res.json({
        success: true,
        data: job
    });
};

const reject = (req, res) => {
    const job = technicianService.rejectJob(req.params.id);
    if (!job)
        return res.status(404).json({
            message: "Job not found"
        });
    res.json({
        success: true,
        data: job
    });
};

const emergency = (req, res) => {
    res.json({
        success: true,
        data: technicianService.getEmergencyJobs()
    });
};

const acceptEmergency = (req, res) => {
    const job = technicianService.acceptEmergency(req.params.id);
    if (!job)
        return res.status(404).json({
            message: "Emergency Job not found"
        });
    res.json({
        success: true,
        data: job
    });
};

const notifications = (req, res) => {
    res.json({
        success: true,
        data: technicianService.getNotifications()
    });
};

const notificationRead = (req, res) => {
    const notification = technicianService.markNotificationRead(req.params.id);
    if (!notification)
        return res.status(404).json({
            message: "Notification not found"
        });
    res.json({
        success: true,
        data: notification
    });
};

module.exports = {
    profile,
    jobs,
    availability,
    location,
    jobStatus,
    accept,
    reject,
    emergency,
    acceptEmergency,
    notifications,
    notificationRead
};