import express from "express";
import userAuth from "../middleware/userAuth.js";
import { RegisterUser, Login, Logout, getCurrentUser } from "../controllers/UserController.js";
const router = express.Router();

router.post('/register', RegisterUser);
router.post('/login', Login);
router.post('/logout', Logout);
router.get('/get-user', userAuth, getCurrentUser)
export default router;
