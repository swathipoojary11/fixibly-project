export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRoleId = req.user?.role_id;

        const roleMap = {
            1: "Customer",
            2: "Technician",
            3: "Dispatcher",
            4: "Admin"
        };

        const userRole = roleMap[userRoleId];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Insufficient permissions."
            });
        }

        next();
    };
};

export default authorizeRoles;