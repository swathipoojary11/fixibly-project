"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const technicianController_1 = require("../controllers/technicianController");
const verifyTechnician_1 = require("../middleware/verifyTechnician");
const router = express_1.default.Router();
// ======================
// Service Categories
// ======================
router.get('/categories', verifyTechnician_1.verifyTechnician, technicianController_1.serviceCategories);
router.put('/category', verifyTechnician_1.verifyTechnician, technicianController_1.updateCategory);
// ======================
// Profile
// ======================
router.get('/profile', verifyTechnician_1.verifyTechnician, technicianController_1.profile);
// ======================
// Assigned Jobs
// ======================
router.get('/jobs', verifyTechnician_1.verifyTechnician, technicianController_1.jobs);
// ======================
// Emergency Jobs
// ======================
router.get('/emergency', verifyTechnician_1.verifyTechnician, technicianController_1.emergency);
// ======================
// Notifications
// ======================
router.get('/notifications', verifyTechnician_1.verifyTechnician, technicianController_1.notifications);
// ======================
// Availability
// ======================
router.put('/availability', verifyTechnician_1.verifyTechnician, technicianController_1.availability);
// ======================
// Live Location
// ======================
router.put('/location', verifyTechnician_1.verifyTechnician, technicianController_1.location);
// ======================
// Accept Job
// ======================
router.put('/jobs/:id/accept', verifyTechnician_1.verifyTechnician, technicianController_1.accept);
// ======================
// Reject Job
// ======================
router.put('/jobs/:id/reject', verifyTechnician_1.verifyTechnician, technicianController_1.reject);
// ======================
// Update Job Status
// ======================
router.put('/jobs/:id/status', verifyTechnician_1.verifyTechnician, technicianController_1.jobStatus);
// ======================
// Complete Job
// ======================
router.put('/jobs/:id/complete', verifyTechnician_1.verifyTechnician, technicianController_1.completeJob);
// ======================
// Accept Emergency Job
// ======================
router.put('/emergency/:id/accept', verifyTechnician_1.verifyTechnician, technicianController_1.acceptEmergency);
// ======================
// Read Notification
// ======================
router.put('/notifications/:id/read', verifyTechnician_1.verifyTechnician, technicianController_1.notificationRead);
exports.default = router;
//# sourceMappingURL=technicianRoutes.js.map