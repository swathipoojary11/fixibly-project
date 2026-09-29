"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
router.get('/overview', adminController_1.getAdminDashboardOverview);
router.get('/stats', adminController_1.getAdminDashboardStats);
router.get('/reports', adminController_1.getAdminReports);
router.get('/dashboard-analytics', adminController_1.getAdminDashboardAnalytics);
router.get('/users', adminController_1.getAdminUsers);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map