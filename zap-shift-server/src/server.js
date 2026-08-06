import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import "./config/firebase.js";
import "./config/stripe.js";
import "./config/mailer.js";

const start = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
};

start();
