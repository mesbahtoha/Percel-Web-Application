import dotenv from "dotenv";

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || "",
  DB_USER: process.env.DB_USER || "",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "parcelDB",

  // CORS
  CLIENT_URL: process.env.CLIENT_URL || "",

  // Firebase Admin
  FB_SERVICE_KEY: process.env.FB_SERVICE_KEY || "",

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",

  // OTP
  OTP_JWT_SECRET:
    process.env.OTP_JWT_SECRET || "otp_secret_key_change_in_production",

  // Mail (Gmail SMTP)
  EMAIL_SENDER: process.env.EMAIL_SENDER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",

  // Brevo (alternative mail provider — optional)
  BREVO_USER: process.env.BREVO_USER || "",
  BREVO_PASS: process.env.BREVO_PASS || "",

  // Business rules
  TAKA_PER_USD: Number(process.env.TAKA_PER_USD) || 120,
};
