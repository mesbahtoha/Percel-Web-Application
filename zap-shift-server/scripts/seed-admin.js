// Seeds admin (and optional demo user) credentials into Firebase Auth + MongoDB.
// Usage:
//   npm run seed:admin                 → seeds admin@gmail.com / admin123
//   npm run seed:admin -- email pass   → seeds a custom admin with email/password
import { connectDB, closeDB, collections } from "../src/config/db.js";
import { now } from "../src/utils/helpers.js";
import { firebaseAdmin } from "../src/config/firebase.js";

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_USER_EMAIL = "user@gmail.com";
const DEFAULT_USER_PASSWORD = "user123";

const upsertFirebaseUser = async ({ email, password, displayName }) => {
  try {
    const existing = await firebaseAdmin.auth().getUserByEmail(email);
    await firebaseAdmin.auth().updateUser(existing.uid, {
      password,
      displayName,
      emailVerified: true,
    });
    console.log(`✅ Firebase: ${email} updated with password`);
    return existing.uid;
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      const created = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
      console.log(`✅ Firebase: ${email} created with password`);
      return created.uid;
    }
    throw error;
  }
};

const upsertDbUser = async ({ email, name, role }) => {
  const users = collections.users();
  const existing = await users.findOne({ email });

  if (existing) {
    await users.updateOne(
      { email },
      {
        $set: {
          role,
          name: name || existing.name || "",
          updated_at: now(),
        },
      }
    );
    console.log(`✅ MongoDB: ${email} promoted to ${role} (existing user)`);
  } else {
    await users.insertOne({
      email,
      name,
      role,
      picture: "",
      created_at: now(),
      last_login: now(),
      updated_at: now(),
    });
    console.log(`✅ MongoDB: ${email} created with role ${role} (new user)`);
  }
};

const main = async () => {
  const customEmail = process.argv[2];
  const customPass = process.argv[3];

  const adminEmail = customEmail || DEFAULT_ADMIN_EMAIL;
  const adminPassword = customPass || DEFAULT_ADMIN_PASSWORD;

  await connectDB();

  // 1) Admin account (email + password login via Firebase)
  await upsertFirebaseUser({
    email: adminEmail,
    password: adminPassword,
    displayName: "Admin",
  });
  await upsertDbUser({ email: adminEmail, name: "Admin", role: "admin" });

  // 2) Demo user account (for the "User Demo Login" button on the login page)
  if (!customEmail) {
    await upsertFirebaseUser({
      email: DEFAULT_USER_EMAIL,
      password: DEFAULT_USER_PASSWORD,
      displayName: "Demo User",
    });
    await upsertDbUser({ email: DEFAULT_USER_EMAIL, name: "Demo User", role: "user" });
  }

  console.log("──────────────────────────────────────────────");
  console.log("Seeding complete. Demo credentials:");
  console.log(`   Admin → ${adminEmail} / ${adminPassword}`);
  if (!customEmail) {
    console.log(`   User  → ${DEFAULT_USER_EMAIL} / ${DEFAULT_USER_PASSWORD}`);
  }
  console.log("──────────────────────────────────────────────");
};

try {
  await main();
} catch (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
} finally {
  await closeDB();
}
