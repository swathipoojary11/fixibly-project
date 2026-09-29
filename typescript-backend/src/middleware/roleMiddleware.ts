import { Request, Response, NextFunction } from "express";


// Logged-in user structure attached by JWT auth
type AuthUser = {
  role_id?: number;
  [key: string]: any;
};

// Express Request with user object
type AuthRequest = Request & {
  user?: AuthUser;
};

// Type mapping numeric IDs (1, 2, 3, 4) to role names
type RoleMap = Record<number, string>;

// ==========================================
// 2. MIDDLEWARE FUNCTION
// ==========================================

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Get role_id from JWT payload attached to req.user
    const userRoleId = req.user?.role_id;

    if (!userRoleId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No role assigned to user."
      });
    }

    // 2. Map role IDs to role names
    const roleMap: RoleMap = {
      1: "Customer",
      2: "Technician",
      3: "Dispatcher",
      4: "Admin"
    };

    const userRole: string | undefined = roleMap[userRoleId];

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

export default authorizeRoles;