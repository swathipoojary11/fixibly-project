const jwt = require("jsonwebtoken");

export type JwtUserPayload = {
  user_id?: string | number;
  role_id?: number;
  [key: string]: any;
};

export const generateToken = (user: JwtUserPayload): string => {
  const secretKey: string = process.env.JWT_SECRET || "fieldflow123456789";

  return jwt.sign(
    {
      user_id: user.user_id,
      role_id: user.role_id
    },
    secretKey,
    { expiresIn: "1d" }
  );
};

export default { generateToken };