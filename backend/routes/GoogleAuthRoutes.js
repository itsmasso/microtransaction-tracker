import express from "express";
import { getAuthUrl, getTokens } from "../utils/googleAuth.js";

const router = express.Router();

router.get("/auth/google", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

router.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const tokens = await getTokens(code);
    //Store tokens (in DB or session)

    const redirectUrl = `http://localhost:5000/gmail-success?accessToken=${tokens.access_token}&refreshToken=${tokens.refresh_token}`;
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Failed to exchange code for tokens:", err.message);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});


export default router;
