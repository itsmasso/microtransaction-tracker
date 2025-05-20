import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import gamesRoute from "./routes/GamesRoutes.js"
import connectDB from "./config/mongodb.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api/games", gamesRoute);

app.listen(PORT, () => {
  console.log("Server is running.");
});
