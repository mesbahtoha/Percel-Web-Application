import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notification.service.js";
import { now, requireEmail } from "../utils/helpers.js";

export const createRiderAccount = async (req, res) => {
  const { email, picture, phone, vehicleType, nid, hub, region, age, name } = req.body;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const riderExists = await collections.riderAccounts().findOne({ email });

  if (riderExists) {
    return res.status(200).send({
      message: "Rider profile already exists",
      inserted: false,
      riderExists: true,
    });
  }

  const riderDoc = {
    name: name || "",
    email,
    age: age || "",
    phone: phone || "",
    nid: nid || "",
    region: region || "",
    hub: hub || "",
    vehicleType: vehicleType || "",
    picture: picture || "",
    role: "rider",
    status: "active",
    approvalStatus: "pending",
    workStatus: "free",
    created_at: now(),
    updated_at: now(),
  };

  const result = await collections.riderAccounts().insertOne(riderDoc);

  await collections.users().updateOne(
    { email },
    { $set: { role: "rider", updated_at: now() } }
  );

  await createNotification({
    type: "rider_request",
    title: "New rider request",
    message: `New rider application from ${email}`,
    recipientRole: "admin",
    relatedId: result.insertedId,
    relatedCollection: "riderAccounts",
    meta: { email },
  });

  res.status(201).send({
    message: "Rider profile created successfully",
    inserted: true,
    result,
  });
};

export const getRiderAccount = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  const requesterEmail = req.decoded.email;
  const user = await collections.users().findOne({ email: requesterEmail });
  const isAdmin = user?.role === "admin";

  if (!isAdmin && requesterEmail !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const rider = await collections.riderAccounts().findOne({ email });

  if (!rider) {
    throw new ApiError(404, "Rider not found");
  }

  res.send(rider);
};

export const updateRiderProfile = async (req, res) => {
  const { email, name, age, phone, picture, vehicleType, nid, hub, region, status } =
    req.body;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const result = await collections.riderAccounts().updateOne(
    { email },
    {
      $set: {
        name: name || "",
        age: age || "",
        phone: phone || "",
        picture: picture || "",
        vehicleType: vehicleType || "",
        nid: nid || "",
        hub: hub || "",
        region: region || "",
        ...(status ? { status } : {}),
        updated_at: now(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new ApiError(404, "Rider not found");
  }

  res.send({ message: "Rider profile updated successfully", result });
};
