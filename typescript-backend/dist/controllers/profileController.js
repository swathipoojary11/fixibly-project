"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const supabase = require("../config/supabase");
const getProfile = async (req, res) => {
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
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.getProfile = getProfile;
// 2. Update Logged-in User Profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.user_id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User ID not found in token."
            });
        }
        const { full_name, phone, address } = req.body;
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
    }
    catch (err) {
        const error = err;
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
exports.updateProfile = updateProfile;
module.exports = {
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile
};
//# sourceMappingURL=profileController.js.map