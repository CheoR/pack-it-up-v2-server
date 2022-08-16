import mongoose from "mongoose";

import config from "./config";

const { URI } = config;

const connectDB = async () => {
  try {
    await mongoose.connect(URI, {});
    console.log("🎉 connected to database successfully");
  } catch (error: unknown) {
    console.error("connectDB Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
