import mongoose from "mongoose";

// Cached across invocations so Vercel serverless functions reuse one connection.
let connection: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI environment variable is not set");

  if (!connection) {
    connection = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || "hudulguun",
        serverSelectionTimeoutMS: 10000,
      })
      .then((m) => {
        console.log("Connected to database");
        return m;
      })
      .catch((err) => {
        connection = null; // allow retry on next request
        throw err;
      });
  }
  return connection;
};
