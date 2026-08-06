import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";
import "../src/config/firebase.js";
import "../src/config/stripe.js";
import "../src/config/mailer.js";

let dbPromise = null;

const ensureDB = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
};

export default async function handler(req, res) {
  try {
    await ensureDB();
    return app(req, res);
  } catch (error) {
    console.error("Serverless handler error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
