// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // ✅ NEXT_PUBLIC_ সরানো হয়েছে

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global cache — development এ hot-reload এ নতুন connection না করার জন্য,
 * production এ serverless function এর মধ্যে reuse করার জন্য।
 * ✅ Fix: production এও globalThis এ save করা হচ্ছে
 */
const cached = globalThis.__mongooseCache ?? { conn: null, promise: null };
globalThis.__mongooseCache = cached; // ✅ সবসময় assign — production এও

async function dbConnect() {
  // ✅ Fix: mongoose.connection.readyState check — আগে conn এ mongoose instance ছিল
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // চলমান connection attempt থাকলে সেটার জন্য অপেক্ষা করো
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 10_000,
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 20_000,
      family: 4,
      heartbeatFrequencyMS: 10_000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => {
        // ✅ Fix: mongoose instance নয়, mongoose.connection return করা হচ্ছে
        console.log("✅ MongoDB connected");
        return mongoose.connection;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        cached.promise = null; // retry এর জন্য reset
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
