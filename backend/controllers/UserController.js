import UsersModel from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/emailer.js";
export const RegisterUser = async (req, res) => {
  const { email, password, recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ message: "reCAPTCHA token missing" });
  }

  const secretKey = process.env.RECAPTCHA_SECRET;
  const verificationURL = "https://www.google.com/recaptcha/api/siteverify";

  try {
    const existingEmail = await UsersModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use." });
    }

    const reCaptchaRes = await fetch(verificationURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${recaptchaToken}`,
    });

    const data = await reCaptchaRes.json();

    if (!data.success) {
      return res.status(400).json({ message: "Failed reCAPTCHA verification" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UsersModel.create({
      email,
      password: hashedPassword,
      isAccountVerified: false,
    });

    return res.json({
      success: true,
      message: "Registered successfully!",
      user: newUser,
    });
  } catch (err) {
    console.error("Failed to register user.", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const Login = async (req, res) => {
  const { email, password, rememberMe } = req.body;
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: rememberMe ? '30d' : '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000,
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
    console.error("Failed to logout.", err);
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
    console.error("Failed to fetch user!", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//send verification otp to the user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await UsersModel.findById(userId);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified." });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 30 * 60 * 1000;

    await user.save();
    await sendVerificationEmail(user.email, otp);
    return res.json({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (err) {
    console.error("Failed to send verification OTP!", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details." });
  }
  try {
    const user = await UsersModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid code." });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      console.log("Verification code expired.");
      return res.status(400).json({
        success: false,
        message: "Verification code expired.",
      });
    }
    //can also do the user.save() way!
    await UsersModel.findByIdAndUpdate(userId, {
      isAccountVerified: true,
      verifyOtp: "",
      verifyOtpExpireAt: 0,
    });

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Email verified successfully!" });
  } catch (err) {
    console.error("Failed to verify email!", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//send password reset email
export const sendResetPassword = async (req, res) =>{
   try {
    const { email} = req.body;
    const user = await UsersModel.findOne({ email});
    if(!user){
      console.error("User not found.");
       return res.status(404).json({success: false, message: "User not found."});
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();
    await sendPasswordResetEmail(user.email, otp);
    return res.json({
      success: true,
      message: "Password reset code sent to email",
    });
  } catch (err) {
    console.error("Failed to send password reset!", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

//reset password
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    //OTP is valid, allow moving to next step (password reset)
    return res.json({
      success: true,
      message: "OTP verified successfully. Proceed to reset password.",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required",
    });
  }

  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    //Clear reset OTP and expiration
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};