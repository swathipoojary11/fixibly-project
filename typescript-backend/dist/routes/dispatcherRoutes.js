"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dispatcherController_1 = require("../controllers/dispatcherController");
const router = express_1.default.Router();
// Assign, Reassign & Lifecycle Routes
router.patch('/assign', dispatcherController_1.assignTechnician);
router.patch('/reassign', dispatcherController_1.reassignTechnician);
router.patch('/status', dispatcherController_1.updateBookingStatus);
router.get("/profile", dispatcherController_1.getDispatcherProfile);
// Emergency Routes
router.post('/emergency/broadcast', dispatcherController_1.triggerEmergencyBroadcast);
router.post('/emergency/accept', dispatcherController_1.acceptEmergencyBroadcast);
router.patch('/emergency/downgrade', dispatcherController_1.downgradeEmergency);
// Customer Search Routes
router.get('/customer', dispatcherController_1.searchCustomerByPhone);
router.get('/customers/search', dispatcherController_1.searchCustomers);
// Stats & Overview Routes for Dispatcher UI
router.get('/technicians/summary', dispatcherController_1.getTechnicianSummaryStats);
router.get('/dashboard-stats', dispatcherController_1.getDispatcherDashboardStats);
router.get('/active-with-location', dispatcherController_1.getActiveBookingsWithLocation);
// Manual Actions
router.post('/manual-booking', dispatcherController_1.createManualBooking);
// module.exports = router;
exports.default = router;
//# sourceMappingURL=dispatcherRoutes.js.map