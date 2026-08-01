const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  getDashboard,
  getJobs,
  getEmergencyJob,
  getTimeline,
  updateLocation,
  acceptJob,
  cancelJob,
  updateJobStatus,
  getNotifications,
  markNotificationRead
} = require("../controllers/technicianController");

// Protected by authenticateUser
router.use(authenticateUser);

router.get("/dashboard", getDashboard);
router.get("/jobs", getJobs);
router.get("/emergency", getEmergencyJob);
router.get("/timeline", getTimeline);
router.put("/location", updateLocation);
router.post("/jobs/:id/accept", acceptJob);
router.post("/jobs/:id/cancel", cancelJob);
router.put("/jobs/:id/status", updateJobStatus);
router.get("/notifications", getNotifications);
router.patch("/notifications/read", markNotificationRead);

module.exports = router;
