import supabase from "../config/supabase.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      address,
      password,
      role
    } = req.body;

    if (!full_name || !email || !password || !role) {
      return errorResponse(res, 400, "Please fill all required fields.");
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Check if email exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return errorResponse(res, 400, "Email already registered.");
    }

    // Role mapping
    let roleId = 1;
    const { data: roleData } = await supabase
      .from("roles")
      .select("role_id")
      .ilike("role_name", role)
      .maybeSingle();

    if (roleData) {
      roleId = roleData.role_id;
    } else {
      const roleMap = {
        customer: 1,
        technician: 2,
        dispatcher: 3,
        admin: 4
      };
      roleId = roleMap[role.toLowerCase()] || 1;
    }

    const encryptedPassword = await hashPassword(cleanPassword);

    const { data: newUser, error } = await supabase
      .from("users")
      .insert([
        {
          full_name: full_name.trim(),
          email: cleanEmail,
          phone: phone ? phone.trim() : "",
          address: address ? address.trim() : "",
          password_hash: encryptedPassword,
          role_id: roleId
        }
      ])
      .select()
      .single();

    if (error) {
      return errorResponse(res, 500, error.message);
    }

    // If registered as technician, ensure record exists in technicians table
    if (roleId === 2) {
      const { data: categoryData } = await supabase
        .from("service_categories")
        .select("category_id")
        .limit(1)
        .single();
        
      await supabase.from("technicians").insert([
        {
          user_id: newUser.user_id,
          category_id: categoryData?.category_id || 1,
          experience: 3,
          rating: 5.0,
          availability_status: "Available"
        }
      ]);
    }

    return successResponse(
      res,
      201,
      "Registration successful."
    );

  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(
        res,
        400,
        "Email and password are required."
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const { data: user, error } = await supabase
      .from("users")
      .select("*, roles(role_name)")
      .ilike("email", cleanEmail)
      .maybeSingle();

    if (error || !user) {
      return errorResponse(
        res,
        401,
        "Invalid email or password."
      );
    }

    if (!user.is_active) {
      return errorResponse(res, 403, "Account is deactivated. Contact admin.");
    }

    const isMatch = await comparePassword(cleanPassword, user.password_hash);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        "Invalid email or password."
      );
    }

    const token = generateToken(user);

    return successResponse(
      res,
      200,
      "Login successful.",
      {
        token,
        user: {
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          role_id: user.role_id,
          role: user.roles?.role_name || (user.role_id === 1 ? 'Customer' : user.role_id === 2 ? 'Technician' : user.role_id === 3 ? 'Dispatcher' : 'Admin')
        }
      }
    );

  } catch (err) {
    return errorResponse(res, 500, err.message);
  }
};

export default { registerUser, loginUser };