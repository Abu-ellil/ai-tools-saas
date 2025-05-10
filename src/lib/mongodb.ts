import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // في بيئة التطوير، إذا لم يكن هناك MONGODB_URI، نعود بنجاح وهمي
  if (!MONGODB_URI && process.env.NODE_ENV === "development") {
    console.log("Development mode: Skipping MongoDB connection");
    return { connection: { readyState: 1 } };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // تغيير إلى true لتجنب الأخطاء
    };

    try {
      console.log("Connecting to MongoDB...");
      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
        console.log("Connected to MongoDB successfully");
        return mongoose;
      });
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      if (process.env.NODE_ENV === "development") {
        // في بيئة التطوير، نعود بنجاح وهمي
        return { connection: { readyState: 1 } };
      }
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Error awaiting MongoDB connection:", error);
    if (process.env.NODE_ENV === "development") {
      // في بيئة التطوير، نعود بنجاح وهمي
      return { connection: { readyState: 1 } };
    }
    throw error;
  }
}

export default connectToDatabase;
