// Promotes a user to admin role in the database.
// Usage: npm run seed:admin -- your@email.com
// Example: npm run seed:admin mdmesbah321@gmail.com
import { connectDB, closeDB, collections } from "../src/config/db.js";
import { now } from "../src/utils/helpers.js";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run seed:admin -- your@email.com");
  process.exit(1);
}

try {
  await connectDB();

  const existing = await collections.users().findOne({ email });

  if (existing) {
    await collections
      .users()
      .updateOne({ email }, { $set: { role: "admin", updated_at: now() } });
    console.log(`✅ ${email} promoted to admin (existing user)`);
  } else {
    await collections.users().insertOne({
      email,
      name: "Admin",
      role: "admin",
      picture: "",
      created_at: now(),
      last_login: now(),
      updated_at: now(),
    });
    console.log(`✅ ${email} created as admin (new user)`);
  }
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
} finally {
  await closeDB();
}
