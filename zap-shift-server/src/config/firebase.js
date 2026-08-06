import admin from "firebase-admin";
import { env } from "./env.js";

if (!env.FB_SERVICE_KEY) {
  console.error("FB_SERVICE_KEY is missing");
  process.exit(1);
}

const decodedKey = Buffer.from(env.FB_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decodedKey);

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
