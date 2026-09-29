"use strict";
// backend/src/controllers/technicianController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeJob = exports.notificationRead = exports.notifications = exports.acceptEmergency = exports.location = exports.availability = exports.jobStatus = exports.reject = exports.accept = exports.emergency = exports.jobs = exports.updateCategory = exports.serviceCategories = exports.profile = void 0;
// Safe import: works whether technicianService is already .ts or still .js
const technicianService = require("../services/technicianService");
// ======================================================
// 2. PROFILE & CATEGORIES
// ======================================================
const profile = async (req, res) => {
    try {
        const userId = req.user?.user_id || req.user?.id;
        const data = await technicianService.getProfile(userId);
        return res.json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.profile = profile;
const serviceCategories = async (req, res) => {
    try {
        const data = await technicianService.getServiceCategories();
        return res.json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.serviceCategories = serviceCategories;
const updateCategory = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const body = req.body;
        const data = await technicianService.updateServiceCategory(techId, body.category_id);
        return res.json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.updateCategory = updateCategory;
// ======================================================
// 3. JOB ASSIGNMENT & LIFECYCLE
// ======================================================
const jobs = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const data = await technicianService.getJobs(techId);
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.jobs = jobs;
const emergency = async (req, res) => {
    try {
        const data = await technicianService.getEmergencyJobs();
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.emergency = emergency;
// 1. Fixed req.params.id type assertion
const accept = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const jobId = req.params.id;
        const data = await technicianService.acceptJob(techId, jobId);
        return res.status(200).json({
            success: true,
            message: "Job accepted successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.accept = accept;
// 2. Fixed req.params.id type assertion
const reject = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const jobId = req.params.id;
        const data = await technicianService.rejectJob(techId, jobId);
        return res.status(200).json({
            success: true,
            message: "Job rejected successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.reject = reject;
// 3. Fixed req.params.id type assertion
const jobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const body = req.body;
        const data = await technicianService.updateJobStatus(jobId, body.status);
        return res.status(200).json({
            success: true,
            message: "Status updated.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.jobStatus = jobStatus;
// ======================================================
// 4. AVAILABILITY & TRACKING
// ======================================================
const availability = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const body = req.body;
        const data = await technicianService.updateAvailability(techId, body.status);
        return res.status(200).json({
            success: true,
            message: "Availability updated successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.availability = availability;
const location = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const body = req.body;
        const data = await technicianService.updateLocation(techId, body.latitude, body.longitude);
        return res.status(200).json({
            success: true,
            message: "Location updated successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.location = location;
// 4. Fixed req.params.id type assertion
const acceptEmergency = async (req, res) => {
    try {
        const techId = req.user?.technician_id;
        const jobId = req.params.id;
        const data = await technicianService.acceptEmergency(techId, jobId);
        return res.status(200).json({
            success: true,
            message: "Emergency job accepted successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.acceptEmergency = acceptEmergency;
// ======================================================
// 5. NOTIFICATIONS & COMPLETION
// ======================================================
const notifications = async (req, res) => {
    try {
        const userId = req.user?.user_id || req.user?.id;
        const data = await technicianService.getNotifications(userId);
        return res.status(200).json({
            success: true,
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.notifications = notifications;
// 5. Fixed req.params.id type assertion
const notificationRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const data = await technicianService.markNotificationRead(notificationId);
        return res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.notificationRead = notificationRead;
// 6. Fixed req.params.id type assertion
const completeJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const data = await technicianService.completeJob(jobId);
        return res.status(200).json({
            success: true,
            message: "Job completed successfully.",
            data
        });
    }
    catch (err) {
        const error = err;
        return res.status(400).json({
            success: false,
            message: error.message || "Bad Request"
        });
    }
};
exports.completeJob = completeJob;
//# sourceMappingURL=technicianController.js.map