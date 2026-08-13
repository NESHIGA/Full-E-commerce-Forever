import mongoose from "mongoose";

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  console.log("🔄 Connecting to MongoDB...");

  cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
    dbName: "e-commerce",
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  })
    .then((conn) => {
      console.log("✅ Database Connected Successfully!");
      console.log("📊 Using Database:", conn.connection.db.databaseName);
      return conn.connection;
    })
    .catch((error) => {
      cachedConnection = null;
      console.error("❌ MongoDB Connection Error:", error.message);
      throw error;
    });

  return cachedConnection;
};

export default connectDB;