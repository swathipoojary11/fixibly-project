const supabase = require("../config/supabase");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/jwt");

// Register User
const registerUser = async (req, res) => {
    console.log("Register API called");
console.log(req.body);
  try {
    const {
      full_name,
      email,
      phone,
      address,
      password,
      role
    } = req.body;

    // Validate required fields
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered."
      });
    }

    // Get role_id
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role_id")
      .eq("role_name", role)
      .single();

    if (roleError || !roleData) {
      return res.status(400).json({
        success: false,
        message: "Invalid role."
      });
    }

    // Encrypt password
    const encryptedPassword = await hashPassword(password);

    // Insert user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          full_name,
          email,
          phone,
          address,
          password_hash: encryptedPassword,
          role_id: roleData.role_id
        }
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Registration successful."
      
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};




// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // Generate JWT
    const token = generateToken(user);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


module.exports = {
  registerUser,
  loginUser
};