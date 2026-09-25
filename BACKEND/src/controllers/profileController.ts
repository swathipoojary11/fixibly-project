import { Request, Response } from "express";
import supabase from "../config/supabase.js";

interface AuthenticatedUser {
    user_id: number;
}

interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}

// =========================
// GET LOGGED-IN USER PROFILE
// =========================

const getProfile = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {

        const userId = req.user.user_id;

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

        if (error) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: data
        });

    } catch (err: unknown) {

        const message =
            err instanceof Error
                ? err.message
                : "Something went wrong.";

        return res.status(500).json({
            success: false,
            message
        });
    }
};


// =========================
// UPDATE LOGGED-IN USER PROFILE
// =========================

const updateProfile = async (
    req: AuthenticatedRequest,
    res: Response
) => {
    try {

        const userId = req.user.user_id;

        const {
            full_name,
            phone,
            address
        } = req.body;

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
                full_name,
                phone,
                address,
                updated_at: new Date()
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

    } catch (err: unknown) {

        const message =
            err instanceof Error
                ? err.message
                : "Something went wrong.";

        return res.status(500).json({
            success: false,
            message
        });
    }
};


// =========================
// EXPORTS
// =========================

export {
    getProfile,
    updateProfile
};