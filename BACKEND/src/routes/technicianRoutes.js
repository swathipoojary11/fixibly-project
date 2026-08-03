const express = require("express");
const router = express.Router();

const {
    profile,
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
} = require("../controllers/technicianController");

const { verifyTechnician } = require("../middleware/verifyTechnician");

// ======================
// Profile
// ======================
router.get("/profile", verifyTechnician, profile);

// ======================
// Assigned Jobs
// ======================
router.get("/jobs", verifyTechnician, jobs);

// ======================
// Emergency Jobs
// ======================
router.get("/emergency", verifyTechnician, emergency);

// ======================
// Notifications
// ======================
router.get("/notifications", verifyTechnician, notifications);

// ======================
// Availability
// ======================
router.put("/availability", verifyTechnician, availability);

// ======================
// Live Location
// ======================
router.put("/location", verifyTechnician, location);

// ======================
// Accept Job
// ======================
router.put("/jobs/:id/accept", verifyTechnician, accept);

// ======================
// Reject Job
// ======================
router.put("/jobs/:id/reject", verifyTechnician, reject);

// ======================
// Update Job Status
// ======================
router.put("/jobs/:id/status", verifyTechnician, jobStatus);

// ======================
// Complete Job
// ======================
router.put("/jobs/:id/complete", verifyTechnician, completeJob);

// ======================
// Accept Emergency Job
// ======================
router.put("/emergency/:id/accept", verifyTechnician, acceptEmergency);

// ======================
// Read Notification
// ======================
router.put("/notifications/:id/read", verifyTechnician, notificationRead);

module.exports = router;