"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
// View Profile
router.get('/', authMiddleware_1.authenticateUser, profileController_1.getProfile);
// Update Profile
router.put('/', authMiddleware_1.authenticateUser, profileController_1.updateProfile);
exports.default = router;
//# sourceMappingURL=profileRoutes.js.map