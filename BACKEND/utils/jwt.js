const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            user_id: user.user_id,
            role_id: user.role_id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};

module.exports = {
    generateToken
};