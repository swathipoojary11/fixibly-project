"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
router.get('/', notificationController_1.getNotifications);
router.get('/unread-count', notificationController_1.getUnreadBadgeCount);
router.patch('/mark-read', notificationController_1.markAllNotificationsRead);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map