import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getAuthUrl = () => {
  const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

  return oAuth2Client.generateAuthUrl({
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
};

export const getTokens = async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    return tokens;
  } catch (err) {
    console.error("Failed to exchange code for tokens:", err);
    throw err;
  }
};


