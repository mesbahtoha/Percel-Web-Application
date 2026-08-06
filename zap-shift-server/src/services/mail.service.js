import { transporter } from "../config/mailer.js";
import { env } from "../config/env.js";

export const sendOtpEmail = async ({ to, otp }) => {
  await transporter.sendMail({
    from: `"Profast" <${env.EMAIL_SENDER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
        <h2 style="color:#16a34a;margin-bottom:8px;">Profast Email Verification</h2>
        <p style="color:#374151;">Use the OTP below to verify your email. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;padding:20px;background:#f3f4f6;border-radius:8px;margin:20px 0;color:#111827;">
          ${otp}
        </div>
        <p style="color:#6b7280;font-size:13px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  });
};
