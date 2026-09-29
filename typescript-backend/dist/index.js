"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authMiddleware_1 = require("./middleware/authMiddleware");
// Route Imports (Default imports from your migrated router files)
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const dispatcherRoutes_1 = __importDefault(require("./routes/dispatcherRoutes"));
const technicianRoutes_1 = __importDefault(require("./routes/technicianRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
// 1. Initialize Express Application with explicit type
const app = express();
// 2. Global Middleware
app.use(cors());
app.use(express.json());
// 3. Root Health Check Route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Fixibly FieldFlow Backend Running Successfully 🚀"
    });
});
// 4. Mount API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/profile", profileRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/dispatcher", dispatcherRoutes_1.default);
app.use("/api/technician", technicianRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/customer", customerRoutes_1.default);
// 5. Protected Test Route (Uses AuthRequest so TS knows req.user exists)
app.get("/api/protected", authMiddleware_1.authenticateUser, (req, res) => {
    return res.json({
        success: true,
        message: "You have accessed a protected route.",
        user: req.user
    });
});
// 6. Server Initialization
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// 7. Export application instance
exports.default = app;
//# sourceMappingURL=index.js.map