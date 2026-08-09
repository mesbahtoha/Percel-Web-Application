import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { now, requireEmail } from "../utils/helpers.js";

export const createUser = async (req, res) => {
  const { email, picture } = req.body;

  requireEmail(email);

  const users = collections.users();
  const existingUser = await users.findOne({ email });

  if (existingUser) {
    const updateDoc = {
      $set: {
        last_login: now(),
        ...(picture ? { picture } : {}),
      },
    };

    const updateResult = await users.updateOne({ email }, updateDoc);

    return res.status(200).send({
      message: "User already exists",
      inserted: false,
      updateResult,
    });
  }

  const userDoc = {
    ...req.body,
    role: "user",
    picture: picture || "",
    created_at: now(),
    last_login: now(),
    updated_at: now(),
  };

  const result = await users.insertOne(userDoc);
  res.send(result);
};

export const updateLastLogin = async (req, res) => {
  const { email, picture } = req.body;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const updateDoc = {
    $set: {
      last_login: now(),
      ...(picture ? { picture } : {}),
    },
  };

  const result = await collections.users().updateOne({ email }, updateDoc);

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.send(result);
};

export const updateProfile = async (req, res) => {
  const { email, name, picture } = req.body;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const result = await collections.users().updateOne(
    { email },
    {
      $set: {
        name: name || "",
        picture: picture || "",
        updated_at: now(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "User not found");
  }

  res.send({ message: "Profile updated successfully", result });
};

export const getUserRole = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  const user = await collections.users().findOne({ email });

  if (user) {
    return res.send({
      role: user.role || "user",
      isAdmin: user.role === "admin",
      isRider: user.role === "rider",
    });
  }

  const rider = await collections.riderAccounts().findOne({ email });

  if (rider) {
    return res.send({ role: "rider", isAdmin: false, isRider: true });
  }

  throw new ApiError(404, "Account not found");
};
