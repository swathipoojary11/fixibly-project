"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jwt = require("jsonwebtoken");
const generateToken = (user) => {
    const secretKey = process.env.JWT_SECRET || "fieldflow123456789";
    return jwt.sign({
        user_id: user.user_id,
        role_id: user.role_id
    }, secretKey, { expiresIn: "1d" });
};
exports.generateToken = generateToken;
exports.default = { generateToken: exports.generateToken };
//# sourceMappingURL=jwt.js.map