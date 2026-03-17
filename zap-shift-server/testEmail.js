/**
 * ✅ EMAIL DIAGNOSTIC SCRIPT
 * 
 * Run this BEFORE starting your server to find the exact problem.
 * 
 * HOW TO RUN:
 *   node test-email.js
 * 
 * PUT THIS FILE in your server project root (same folder as index.js / server.js)
 * and fill in your real credentials below.
 */

import nodemailer from "nodemailer";

// ─────────────────────────────────────────────
// 🔧 FILL THESE IN (use your actual values)
// ─────────────────────────────────────────────
const EMAIL_SENDER = "mdmesbah321@gmail.com";   // ← your Gmail address
const EMAIL_PASS   = "imrt aazf ftdt ybwm";    // ← Gmail App Password (16 chars, spaces ok)
const SEND_TEST_TO = "mesbahulalam017@gmail.com";   // ← where to send the test email (can be yourself)
// ─────────────────────────────────────────────

console.log("\n=== Profast Email Diagnostic ===\n");

// Step 1: Check credentials are filled in
console.log("📋 Step 1 — Checking credentials...");
if (EMAIL_SENDER.includes("your_gmail")) {
  console.error("❌ You forgot to fill in EMAIL_SENDER in this file!");
  process.exit(1);
}
if (EMAIL_PASS.includes("xxxx")) {
  console.error("❌ You forgot to fill in EMAIL_PASS in this file!");
  process.exit(1);
}
console.log("   EMAIL_SENDER:", EMAIL_SENDER);
console.log("   EMAIL_PASS length:", EMAIL_PASS.replace(/\s/g, "").length, "(should be 16)");
if (EMAIL_PASS.replace(/\s/g, "").length !== 16) {
  console.warn("⚠️  WARNING: App Password should be exactly 16 characters.");
  console.warn("   You might be using your real Gmail password — that won't work.");
  console.warn("   Get an App Password from: https://myaccount.google.com/apppasswords");
}

// Step 2: Create transporter
console.log("\n📋 Step 2 — Creating transporter...");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASS,
  },
});
console.log("   ✅ Transporter created.");

// Step 3: Verify SMTP connection
console.log("\n📋 Step 3 — Verifying SMTP connection to Gmail...");
console.log("   (This proves your credentials work BEFORE sending)");
try {
  await transporter.verify();
  console.log("   ✅ SMTP connection successful! Credentials are valid.");
} catch (err) {
  console.error("   ❌ SMTP connection FAILED!");
  console.error("   Error code:", err.code);
  console.error("   Error message:", err.message);
  console.log("\n💡 What this error means:");

  if (err.code === "EAUTH" || err.message.includes("535") || err.message.includes("Username and Password")) {
    console.log("   → Your EMAIL_PASS is WRONG.");
    console.log("   → You must use a Gmail App Password, NOT your regular Gmail password.");
    console.log("   → Steps to fix:");
    console.log("     1. Go to https://myaccount.google.com/security");
    console.log("     2. Turn on 2-Step Verification");
    console.log("     3. Go to https://myaccount.google.com/apppasswords");
    console.log("     4. Create an App Password for 'Mail'");
    console.log("     5. Copy the 16-char code and paste into EMAIL_PASS");
  } else if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
    console.log("   → Cannot reach smtp.gmail.com — check your internet/firewall.");
  } else if (err.message.includes("534") || err.message.includes("less secure")) {
    console.log("   → Gmail is blocking 'less secure app' access.");
    console.log("   → Use an App Password instead (see steps above).");
  } else if (err.message.includes("ETIMEDOUT") || err.code === "ETIMEDOUT") {
    console.log("   → Connection timed out. Your server/hosting might be blocking port 465.");
    console.log("   → Try port 587 with secure:false and requireTLS:true instead.");
  } else {
    console.log("   → Unknown error. Full details above.");
  }

  process.exit(1);
}

// Step 4: Try actually sending an email
console.log("\n📋 Step 4 — Sending a test email to:", SEND_TEST_TO);
try {
  const info = await transporter.sendMail({
    from: `"Profast Test" <${EMAIL_SENDER}>`,
    to: SEND_TEST_TO,
    subject: "✅ Profast Email Test",
    html: `
      <div style="font-family:Arial,sans-serif;padding:24px;max-width:480px;">
        <h2 style="color:#16a34a;">Email is working! ✅</h2>
        <p>If you see this, your nodemailer config is correct.</p>
        <div style="font-size:36px;font-weight:bold;text-align:center;padding:20px;
                    background:#f3f4f6;border-radius:8px;letter-spacing:8px;">
          123456
        </div>
        <p style="color:#6b7280;font-size:13px;">This was a test from your diagnostic script.</p>
      </div>
    `,
  });
  console.log("   ✅ Email sent successfully!");
  console.log("   Message ID:", info.messageId);
  console.log("\n🎉 Everything works! Copy your credentials to your .env file:");
  console.log(`   EMAIL_SENDER=${EMAIL_SENDER}`);
  console.log(`   EMAIL_PASS=${EMAIL_PASS}`);
} catch (err) {
  console.error("   ❌ Send failed!");
  console.error("   Error:", err.message);
  process.exit(1);
}