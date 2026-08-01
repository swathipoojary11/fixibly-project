import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            role_id: user.role_id
        },
        process.env.JWT_SECRET || "fieldflow123456789",
        {
            expiresIn: "1d"
        }
    );
};
