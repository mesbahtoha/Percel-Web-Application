import nodemailer from "nodemailer";
import { env } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_SENDER,
    pass: env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ Nodemailer SMTP connection failed:", error.message);
  } else {
    console.log("✅ Nodemailer SMTP ready — OTP emails will work");
  }
});
