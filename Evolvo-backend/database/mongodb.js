import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please define the DB_URI environment variable .env<development/production>.local",
  );
}

const connectToDataBase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connected to Databse in ${NODE_ENV} mode.`)
  } catch (error) {
    console.error("Error connecting to Database: ", error);
    process.exit(1);
  }
};

export default connectToDataBase;
