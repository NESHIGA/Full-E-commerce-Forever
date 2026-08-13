import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "e-commerce",
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    console.log("✅ Database Connected Successfully!");
    console.log("📊 Using Database:", mongoose.connection.db.databaseName);
    
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Don't exit - Vercel will handle it
  }
};

export default connectDB;