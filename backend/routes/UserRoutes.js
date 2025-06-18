import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  RegisterUser,
  Login,
  Logout,
  getCurrentUser,
  sendVerifyOtp,
  verifyEmail,
  resetPassword,
  verifyOtp,
  sendResetPassword,
    changeEmail,
deleteAccount,
changePassword,
GoogleLogin,
} from "../controllers/UserController.js";
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", Login);
router.post("/logout", Logout);
router.get("/get-user", userAuth, getCurrentUser);
router.post("/send-verification-code", sendVerifyOtp);
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/send-reset-otp", sendResetPassword);
router.post("/change-email", changeEmail);
router.post("/change-password", changePassword);
router.post('/delete-account', deleteAccount);
router.post("/google-login", GoogleLogin);
export default router;
