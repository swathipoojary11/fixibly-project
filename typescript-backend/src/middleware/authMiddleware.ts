import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");


type IdType = string | number;

// Shape of the decoded JWT user token
export type AuthenticatedUser = {
  id?: IdType;
  user_id?: IdType;
  technician_id?: IdType;
  role?: string;
  name?: string;
  email?: string;
  [key: string]: any; // Allows custom claims stored in the JWT
};

// Express Request extended with our user object
export type AuthRequest = Request & {
  user?: AuthenticatedUser;
};

// ==========================================
// 2. MIDDLEWARE FUNCTIONS
// ==========================================

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    const secretKey: string = process.env.JWT_SECRET || "fieldflow123456789";

    // Verify JWT
    const decoded = jwt.verify(token, secretKey) as AuthenticatedUser;

    // Store logged-in user details in the request
    req.user = decoded;

    // Continue to next middleware / controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
};

// Mock technician middleware for testing / development
export const verifyTechnician = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.user = {
    id: 1,
    technician_id: 1,
    role: "Technician",
    name: "Rahul Sharma"
  };
  next();
};

// Export default so both `import authenticateUser from ...`
// and `import { authenticateUser, verifyTechnician } from ...` work.
export default authenticateUser;