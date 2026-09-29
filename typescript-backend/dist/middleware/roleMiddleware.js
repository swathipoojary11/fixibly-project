"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
// ==========================================
// 2. MIDDLEWARE FUNCTION
// ==========================================
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // 1. Get role_id from JWT payload attached to req.user
        const userRoleId = req.user?.role_id;
        if (!userRoleId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. No role assigned to user."
            });
        }
        // 2. Map role IDs to role names
        const roleMap = {
            1: "Customer",
            2: "Technician",
            3: "Dispatcher",
            4: "Admin"
        };
        const userRole = roleMap[userRoleId];
        // 3. Check if the user's role is in the allowedRoles list
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }
        // 4. Permission granted, proceed to the controller
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
exports.default = exports.authorizeRoles;
//# sourceMappingURL=roleMiddleware.js.map