import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "e-commerce",
    });

    console.log("Database Connected");
  } catch (err) {
    console.error("Mongo Error:", err);
  }
};

export default connectDB;