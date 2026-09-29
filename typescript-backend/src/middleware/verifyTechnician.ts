import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
type IdType = string | number;

// Decoded JWT payload shape
type DecodedToken = {
  user_id?: IdType;
  id?: IdType;
  userId?: IdType;
  [key: string]: any;
};

// Express Request extended with the attached technician credentials
export type TechAuthRequest = Request & {
  user?: {
    user_id: IdType;
    technician_id: IdType;
    [key: string]: any;
  };
};

// Custom error type for catch blocks
type CustomError = {
  message?: string;
};

// ==========================================
// 2. MIDDLEWARE FUNCTION
// ==========================================

export const verifyTechnician = async (
  req: TechAuthRequest,
  res: Response,
  next: NextFunction
) => {
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

    const secretKey: string = process.env.JWT_SECRET || "fieldflow123456789";
    const decoded = jwt.verify(token, secretKey) as DecodedToken;
    const userId = decoded.user_id || decoded.id || decoded.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload."
      });
    }

    // Check user record in users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role_id")
      .eq("user_id", userId)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid user credentials."
      });
    }

    // Check technician profile
    let { data, error } = await supabase
      .from("technicians")
      .select("technician_id")
      .eq("user_id", userId)
      .maybeSingle();

    // Auto-provision a technician record if not yet created
    if (!data) {
      const insertResult = await supabase
        .from("technicians")
        .upsert(
          [
            {
              user_id: userId,
              category_id: 1,
              experience: 0,
              rating: 0,
              availability_status: "Offline"
            }
          ],
          { onConflict: "user_id" }
        )
        .select("technician_id")
        .maybeSingle();

      if (insertResult.error) {
        console.error("Technician provisioning error:", insertResult.error);
        return res.status(500).json({
          success: false,
          message: insertResult.error?.message || "Unable to provision technician profile."
        });
      }

      data = insertResult.data;
      error = null;
    }

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Technician not found"
      });
    }

    // Attach credentials to request for downstream controllers
    req.user = {
      user_id: userId,
      technician_id: data.technician_id
    };

    next();
  } catch (err) {
    const error = err as CustomError;
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid or expired token."
    });
  }
};

export default verifyTechnician;

// module.exports = {
//     verifyTechnician
// };