"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTechnician = void 0;
const jwt = require("jsonwebtoken");
const supabase = require("../config/supabase");
// ==========================================
// 2. MIDDLEWARE FUNCTION
// ==========================================
const verifyTechnician = async (req, res, next) => {
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
        const secretKey = process.env.JWT_SECRET || "fieldflow123456789";
        const decoded = jwt.verify(token, secretKey);
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
                .upsert([
                {
                    user_id: userId,
                    category_id: 1,
                    experience: 0,
                    rating: 0,
                    availability_status: "Offline"
                }
            ], { onConflict: "user_id" })
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
    }
    catch (err) {
        const error = err;
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid or expired token."
        });
    }
};
exports.verifyTechnician = verifyTechnician;
exports.default = exports.verifyTechnician;
// module.exports = {
//     verifyTechnician
// };
//# sourceMappingURL=verifyTechnician.js.map