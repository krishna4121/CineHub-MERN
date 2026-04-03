const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl = "mongodb://127.0.0.1:27017/bms";

  if (!mongoUrl) {
    throw new Error("MONGODB_URI or ATLASDB_URL is not configured.");
  }

  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
