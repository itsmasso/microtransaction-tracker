import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  //Optional for Google users
  password: { type: String, default: null },

  //Google login
  googleId: { type: String, default: null },
  name: { type: String, default: "" },
  profilePicture: { type: String, default: "" },

  //Email verification 
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },

  //Password reset 
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

const UsersModel = mongoose.model("users", UsersSchema);
export default UsersModel;