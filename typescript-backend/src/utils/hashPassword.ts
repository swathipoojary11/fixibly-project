import bcrypt from "bcrypt";

// Encrypt password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds: number = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare entered password with encrypted password
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export default {
  hashPassword,
  comparePassword
};