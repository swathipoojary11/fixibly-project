const supabase = require("../../config/supabase");

// Get Logged-in User Profile
const getProfile = async (req, res) => {
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

        res.status(200).json({
            success: true,
            user: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Update Logged-in User Profile
const updateProfile = async (req, res) => {
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

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};


module.exports = {
    getProfile,
    updateProfile
};
