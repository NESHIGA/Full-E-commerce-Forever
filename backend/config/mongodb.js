import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "e-commerce",
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("Database Connected");
  } catch (err) {
    console.error("Mongo Error:", err);
  }
};

export default connectDB;