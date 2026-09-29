

import { Request, Response } from "express";
const supabase = require("../config/supabase");

// Get Logged-in User Profile

type IdType = string | number;

// Request with authenticated user payload from authMiddleware
type AuthRequest = Request & {
  user?: {
    user_id?: IdType;
    id?: IdType;
  };
};

type UpdateProfileBody = {
  full_name?: string;
  phone?: string;
  address?: string;
};
type CustomError = {
  message?: string;
};


export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in token."
      });
    }

    const { data, error } = await supabase
      .from("users")
      .select(`
        user_id,
        full_name,
        email,
        phone,
        address,
        is_active,
        created_at,
        updated_at,
        roles(role_name)
      `)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    return res.status(200).json({
      success: true,
      user: data
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 2. Update Logged-in User Profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID not found in token."
      });
    }

    const { full_name, phone, address } = req.body as UpdateProfileBody;

    // Validation
    if (!full_name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        full_name: full_name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
      .select(`
        user_id,
        full_name,
        email,
        phone,
        address,
        is_active,
        updated_at
      `)
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: data
    });
  } catch (err) {
    const error = err as CustomError;
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

module.exports = {
    getProfile,
    updateProfile
};
