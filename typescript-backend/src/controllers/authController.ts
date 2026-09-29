import { Request, Response } from "express";

const supabase = require("../config/supabase");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/jwt");
const { successResponse, errorResponse } = require("../utils/response");

type RoleKey = "customer" | "technician" | "dispatcher" | "admin";

type RegisterBody = {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  role?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

type CustomError = {
  message?: string;
};

// Register User
export const registerUser = async (req: Request, res: Response) => {
  console.log("Register API called");
  console.log(req.body);

  try {
    const body = req.body as RegisterBody;
    const { full_name, email, phone, address, password, role } = body;

    // Validate required fields
    if (!full_name || !email || !password || !role) {
      return errorResponse(res, 400, "Please fill all required fields.");
    }

    const cleanEmail: string = email.trim().toLowerCase();
    const cleanPassword: string = password.trim();

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return errorResponse(res, 400, "Email already registered.");
    }

    // Get role_id (case-insensitive search with default role fallback)
    let roleId: number | null = null;
    const { data: roleData } = await supabase
      .from("roles")
      .select("role_id")
      .ilike("role_name", role)
      .maybeSingle();

    if (roleData) {
      roleId = roleData.role_id;
    } else {
      const roleMap: Record<RoleKey, number> = {
        customer: 1,
        technician: 2,
        dispatcher: 3,
        admin: 4
      };
      const normalizedRole = role.toLowerCase() as RoleKey;
      roleId = roleMap[normalizedRole] || 1;
    }

    // Encrypt password
    const encryptedPassword = await hashPassword(cleanPassword);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: full_name.trim(),
          email: cleanEmail,
          phone: phone ? phone.trim() : "",
          address: address ? address.trim() : "",
          password_hash: encryptedPassword,
          role_id: roleId
        }
      ])
      .select();

    if (error) {
      console.error("Supabase registration insert error:", error);
      return errorResponse(res, 500, error.message);
    }

    return successResponse(res, 201, "Registration successful.");
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginBody;
    const { email, password } = body;

    // Check required fields
    if (!email || !password) {
      return errorResponse(
        res,
        400,
        "Email and password are required."
      );
    }

    const cleanEmail: string = email.trim().toLowerCase();
    const cleanPassword: string = password.trim();

    // Find user by email (case-insensitive search)
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .ilike("email", cleanEmail)
      .single();

    if (error || !user) {
      return errorResponse(
        res,
        401,
        "Invalid email or password."
      );
    }

    // Compare password
    const isMatch: boolean = await comparePassword(cleanPassword, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token: string = generateToken(user);

    // Send response
    return successResponse(
      res,
      200,
      "Login successful.",
      {
        token,
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role_id: user.role_id
        }
      }
    );
  } catch (err) {
    const error = err as CustomError;
    return errorResponse(res, 500, error.message || "Internal server error");
  }
};