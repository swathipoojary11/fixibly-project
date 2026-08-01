import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fieldflow123456789");
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export const verifyTechnician = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid token format." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fieldflow123456789");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authenticateUser;