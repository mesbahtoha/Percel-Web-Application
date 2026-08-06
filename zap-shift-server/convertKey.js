// Dev utility: base64-encode the Firebase service account JSON
// Usage: node convertKey.js  (expects ./firebase-admin-key.json in the same folder)
import fs from "fs";

const file = "./firebase-admin-key.json";

if (!fs.existsSync(file)) {
  console.error("firebase-admin-key.json not found");
  process.exit(1);
}

const key = fs.readFileSync(file, "utf8");
const base64 = Buffer.from(key).toString("base64");
console.log(base64);
