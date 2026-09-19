import * as technicianService from "../services/technicianService.js";

// ======================================================
// PROFILE
// ======================================================

export const profile = async (req, res) => {
    try {
        const data = await technicianService.getProfile(req.user.user_id);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// SERVICE CATEGORIES
// ======================================================

export const serviceCategories = async (req, res) => {
    try {
        const data = await technicianService.getServiceCategories();
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// UPDATE SERVICE CATEGORY
// ======================================================

export const updateCategory = async (req, res) => {
    try {
        const data = await technicianService.updateServiceCategory(
            req.user.technician_id,
            req.body.category_id
        );
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ======================================================
// ASSIGNED JOBS
// ======================================================

const jobs = async (req, res) => {

    try {

        const data = await technicianService.getJobs(
            req.user.technician_id
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// EMERGENCY JOBS
// ======================================================

const emergency = async (req, res) => {

    try {

        const data = await technicianService.getEmergencyJobs();

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// ACCEPT JOB
// ======================================================

const accept = async (req, res) => {

    try {

        const data = await technicianService.acceptJob(
            req.user.technician_id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Job accepted successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// REJECT JOB
// ======================================================

const reject = async (req, res) => {

    try {

        const data = await technicianService.rejectJob(
            req.user.technician_id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Job rejected successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// UPDATE STATUS
// ======================================================

const jobStatus = async (req, res) => {

    try {

        const data = await technicianService.updateJobStatus(
            req.params.id,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Status updated.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// UPDATE AVAILABILITY
// ======================================================

const availability = async (req, res) => {

    try {

        const data = await technicianService.updateAvailability(
            req.user.technician_id,
            req.body.status
        );

        return res.status(200).json({
            success: true,
            message: "Availability updated successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// UPDATE LOCATION
// ======================================================

const location = async (req, res) => {

    try {

        const data = await technicianService.updateLocation(
            req.user.technician_id,
            req.body.latitude,
            req.body.longitude
        );

        return res.status(200).json({
            success: true,
            message: "Location updated successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// ACCEPT EMERGENCY
// ======================================================

const acceptEmergency = async (req, res) => {

    try {

        const data = await technicianService.acceptEmergency(
            req.user.technician_id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Emergency job accepted successfully.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// NOTIFICATIONS
// ======================================================

const notifications = async (req, res) => {

    try {

        const data = await technicianService.getNotifications(
            req.user.user_id
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// MARK NOTIFICATION READ
// ======================================================

const notificationRead = async (req, res) => {

    try {

        const data = await technicianService.markNotificationRead(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================================
// COMPLETE JOB
// ======================================================

const completeJob = async (req, res) => {

    try {

        const data = await technicianService.completeJob(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Job completed successfully.",
            data
        });

    } catch (err) {

        return res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

export {
    jobs,
    emergency,
    accept,
    reject,
    jobStatus,
    availability,
    location,
    acceptEmergency,
    notifications,
    notificationRead,
    completeJob
};

