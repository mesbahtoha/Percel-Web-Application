import { firebaseAdmin } from "../config/firebase.js";
import { collections } from "../config/db.js";

export const verifyFBToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "unauthorized access" });
  }

  try {
    const decoded = await firebaseAdmin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch {
    return res.status(403).send({ message: "forbidden access" });
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    const user = await collections.users().findOne({ email });

    if (!user) {
      return res.status(403).send({ message: "admin user not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).send({ message: "admin only access" });
    }

    req.adminUser = user;
    next();
  } catch (error) {
    res.status(500).send({ message: "Failed to verify admin", error: error.message });
  }
};

export const verifyRiderOrAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;

    if (!email) {
      return res.status(401).send({ message: "unauthorized access" });
    }

    const user = await collections.users().findOne({ email });
    const rider = await collections.riderAccounts().findOne({ email });

    const isAdmin = user?.role === "admin";
    const isRider = !!rider;

    if (!isAdmin && !isRider) {
      return res.status(403).send({ message: "forbidden access" });
    }

    req.isAdmin = isAdmin;
    req.isRider = isRider;
    req.currentRider = rider || null;

    next();
  } catch (error) {
    res.status(500).send({ message: "Failed to verify access", error: error.message });
  }
};
