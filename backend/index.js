import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import gamesRoute from "./routes/GamesRoutes.js";
import connectDB from "./config/mongodb.js";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT;
connectDB();
const app = express();

const allowedOrigins = ["http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/games", gamesRoute);

app.listen(PORT, () => {
  console.log("Server is running.");
});
