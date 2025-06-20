import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import gamesRoute from "./routes/GamesRoutes.js";
import connectDB from "./config/mongodb.js";
import cookieParser from "cookie-parser";
import googleAuthRoutes from "./routes/GoogleAuthRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://microtransaction-tracker-ox1ac4g9e-itsmassos-projects.vercel.app",
  "https://microtransaction-tracker.vercel.app",
  "https://mtxtracker.com",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/games", gamesRoute);
app.use("/", googleAuthRoutes);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.listen(PORT, () => {
  console.log("Server is running.");
});
