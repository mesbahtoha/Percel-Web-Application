import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOtpEmail } from "../services/mail.service.js";

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign({ email, otp }, env.OTP_JWT_SECRET, { expiresIn: "5m" });

  try {
    await sendOtpEmail({ to: email, otp });
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP", error);
  }

  res.send({
    success: true,
    message: "OTP sent successfully",
    token,
  });
};

export const verifyOtp = async (req, res) => {
  const { email, otp, token } = req.body;

  if (!email || !otp || !token) {
    throw new ApiError(400, "Email, OTP, and token are required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.OTP_JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }
    throw new ApiError(400, "Invalid token. Please request a new OTP.");
  }

  if (decoded.email !== email || decoded.otp !== otp) {
    throw new ApiError(400, "Invalid OTP. Please try again.");
  }

  res.send({ success: true, message: "Email verified successfully" });
};
