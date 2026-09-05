import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

export const {
  PORT = "3000",
  NODE_ENV = "development",
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AI_API_KEY,
  CORS_ORIGINS,
  APPLE_ISSUER_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
  APPLE_BUNDLE_ID,
  APPLE_APP_ID,
} = process.env;

export const allowedCorsOrigins = (CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);