import { verifyTechnician } from "../middleware/authMiddleware.js";
import express from "express";

import {
  profile,
  dashboard,
  jobs,
  jobDetails,
  timeline,
  availability,
  location,
  jobStatus,
  accept,
  reject,
  emergency,
  acceptEmergency,
  notifications,
  notificationRead
} from "../controllers/technicianController.js";

const router = express.Router();

router.get("/profile", verifyTechnician, profile);

router.get("/dashboard", verifyTechnician, dashboard);

router.get("/jobs", verifyTechnician, jobs);

router.get("/jobs/:id", verifyTechnician, jobDetails);

router.get("/timeline", verifyTechnician, timeline);

router.patch("/availability", verifyTechnician, availability);

router.patch("/location", verifyTechnician, location);

router.patch("/jobs/:id/status", verifyTechnician, jobStatus);

router.patch("/jobs/:id/accept", verifyTechnician, accept);

router.patch("/jobs/:id/reject", verifyTechnician, reject);

router.get("/emergency", verifyTechnician, emergency);

router.patch("/emergency/:id/accept", verifyTechnician, acceptEmergency);

router.get("/notifications", verifyTechnician, notifications);

router.patch("/notifications/:id/read", verifyTechnician, notificationRead);

export default router;