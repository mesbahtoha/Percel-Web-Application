import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { now } from "../utils/helpers.js";
import { transporter } from "../config/mailer.js";
import { env } from "../config/env.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const submitContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !String(name).trim()) {
    throw new ApiError(400, "Name is required");
  }
  if (!email || !emailPattern.test(String(email))) {
    throw new ApiError(400, "A valid email is required");
  }
  if (!subject || !String(subject).trim()) {
    throw new ApiError(400, "Subject is required");
  }
  if (!message || String(message).trim().length < 10) {
    throw new ApiError(400, "Message must be at least 10 characters");
  }

  const doc = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    subject: String(subject).trim(),
    message: String(message).trim(),
    created_at: now(),
  };

  await collections.contacts().insertOne(doc);

  if (env.EMAIL_SENDER && env.EMAIL_PASS) {
    await transporter.sendMail({
      from: `"${doc.name}" <${env.EMAIL_SENDER}>`,
      to: env.EMAIL_SENDER,
      replyTo: doc.email,
      subject: `[Profast Support] ${doc.subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="color:#16a34a;margin-bottom:8px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${doc.name}</p>
          <p><strong>Email:</strong> ${doc.email}</p>
          <p><strong>Subject:</strong> ${doc.subject}</p>
          <hr />
          <p style="color:#374151;white-space:pre-wrap;">${doc.message}</p>
        </div>
      `,
    });
  }

  res.status(201).send({
    success: true,
    message: "Message sent successfully. We will get back to you soon.",
  });
};
