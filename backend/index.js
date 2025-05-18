import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/UserRoutes.js";
import connectDB from "./config/mongodb.js";

dotenv.config();
const PORT = process.env.PORT || 3001;
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running.");
});
