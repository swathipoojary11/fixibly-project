"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTechnician = exports.authenticateUser = void 0;
const jwt = require("jsonwebtoken");
// ==========================================
// 2. MIDDLEWARE FUNCTIONS
// ==========================================
const authenticateUser = (req, res, next) => {
    try {
        // Get Authorization Header (e.g. "Bearer eyJhbG...")
        const authHeader = req.headers.authorization;
        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }
        // Expected format: "Bearer <token>"
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format."
            });
        }
        // Secret fallback matching your environment config
        const secretKey = process.env.JWT_SECRET || "fieldflow123456789";
        // Verify JWT
        const decoded = jwt.verify(token, secretKey);
        // Store logged-in user details in the request
        req.user = decoded;
        // Continue to next middleware / controller
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};
exports.authenticateUser = authenticateUser;
// Mock technician middleware for testing / development
const verifyTechnician = (req, res, next) => {
    req.user = {
        id: 1,
        technician_id: 1,
        role: "Technician",
        name: "Rahul Sharma"
    };
    next();
};
exports.verifyTechnician = verifyTechnician;
// Export default so both `import authenticateUser from ...`
// and `import { authenticateUser, verifyTechnician } from ...` work.
exports.default = exports.authenticateUser;
//# sourceMappingURL=authMiddleware.js.map