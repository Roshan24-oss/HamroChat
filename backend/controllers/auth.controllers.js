import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import genToken from "../config/token.js";

// ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // Check if userName already exists
    if (await User.findOne({ userName })) {
      return res.status(400).json({ message: "UserName already exists" });
    }

    // Check if email already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate password length
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false, // true if using HTTPS
    });

    // Return safe user data (no password)
    return res.status(201).json({
      user: {
        _id: user._id,
        userName: user.userName,
        name: user.name || "",
        email: user.email,
        image: user.image || "",
      },
      message: "Sign up successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
      secure: false, // true if using HTTPS
    });

    // Return safe user data
    return res.status(200).json({
      user: {
        _id: user._id,
        userName: user.userName,
        name: user.name || "",
        email: user.email,
        image: user.image || "",
      },
      message: "Login successful",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Login failed. Internal server error: ${error.message}` });
  }
};

// ================= LOGOUT =================
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Logout failed. Internal server error: ${error.message}` });
  }
};
