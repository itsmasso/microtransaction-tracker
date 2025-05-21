import UsersModel from "../models/Users.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
  const { email } = req.body;
  const userData = req.body;

  try {
    const existingEmail = await UsersModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use." });
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }

    const newUser = await UsersModel.create(userData);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "Registered successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error("Failed to register user.");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "This account does not exist." });
    }

    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully!" });
  } catch (err) {
    console.error("Failed to login.");
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    console.error("Failed to logout.");
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await UsersModel.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Failed to fetch user!");
    return res.status(500).json({ success: false, message: err.message });
  }
};
