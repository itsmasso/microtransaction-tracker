import mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

const UsersModel = mongoose.model("users", UsersSchema);
export default UsersModel;