import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "./env.js";

let client = null;
let database = null;

const buildUri = () => {
  if (env.MONGODB_URI) return env.MONGODB_URI;
  return `mongodb+srv://${env.DB_USER}:${env.DB_PASSWORD}@mesbahul01.jvrqgnw.mongodb.net/?retryWrites=true&w=majority&appName=Mesbahul01`;
};

const createIndexes = async (db) => {
  const users = db.collection("users");
  const riderAccounts = db.collection("riderAccounts");
  const parcels = db.collection("parcels");
  const payments = db.collection("payments");
  const notifications = db.collection("notifications");

  await users.createIndex({ email: 1 }, { unique: true });
  await riderAccounts.createIndex({ email: 1 }, { unique: true });
  await parcels.createIndex({ trackingId: 1 }, { unique: true, sparse: true });
  await payments.createIndex({ transactionId: 1 }, { unique: true, sparse: true });
  await notifications.createIndex({ recipientRole: 1, createdAt: -1 });
};

export const connectDB = async () => {
  client = new MongoClient(buildUri(), {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  await client.db("admin").command({ ping: 1 });

  database = client.db(env.DB_NAME);
  await createIndexes(database);

  console.log("✅ MongoDB connected");
  return database;
};

export const closeDB = async () => {
  await client?.close();
  client = null;
  database = null;
};

export const getCollection = (name) => {
  if (!database) throw new Error("Database not connected");
  return database.collection(name);
};

export const collections = {
  users: () => getCollection("users"),
  riderAccounts: () => getCollection("riderAccounts"),
  parcels: () => getCollection("parcels"),
  payments: () => getCollection("payments"),
  riderTasks: () => getCollection("riderTasks"),
  riderEarnings: () => getCollection("riderEarnings"),
  notifications: () => getCollection("notifications"),
};
