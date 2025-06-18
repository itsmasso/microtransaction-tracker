import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database Connected!")
  );

  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); 
  }
};

export default connectDB;