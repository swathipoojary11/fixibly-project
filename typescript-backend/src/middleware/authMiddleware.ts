const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Expected format: Bearer <token>
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fieldflow123456789");

        // Store logged-in user details
        req.user = decoded;

        // Continue to next function
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

const verifyTechnician = (req, res, next) => {
    req.user = {
        id: 1,
        role: "Technician",
        name: "Rahul Sharma"
    };
    next();
};

module.exports = authenticateUser;
module.exports.authenticateUser = authenticateUser;
module.exports.verifyTechnician = verifyTechnician;
