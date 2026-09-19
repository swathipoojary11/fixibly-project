const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Get role_id from JWT
        const userRoleId = req.user.role_id;

        // Map role IDs to role names
        const roleMap = {
            1: "Customer",
            2: "Technician",
            3: "Dispatcher",
            4: "Admin"
        };

        const userRole = roleMap[userRoleId];

        // Check if the user's role is allowed
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }

        next();
    };
};

module.exports = authorizeRoles;
