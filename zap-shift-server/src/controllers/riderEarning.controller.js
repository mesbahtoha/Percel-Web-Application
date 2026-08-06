import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import {
  now,
  requireEmail,
  serializeDoc,
} from "../utils/helpers.js";

const isRequesterAuthorized = async (requesterEmail, targetEmail) => {
  const user = await collections.users().findOne({ email: requesterEmail });
  const isAdmin = user?.role === "admin";
  if (!isAdmin && requesterEmail !== targetEmail) {
    throw new ApiError(403, "forbidden access");
  }
};

export const createRiderEarning = async (req, res) => {
  const { riderEmail, parcelId, amount } = req.body;

  if (!riderEmail || !parcelId) {
    throw new ApiError(400, "riderEmail and parcelId are required");
  }

  const existing = await collections
    .riderEarnings()
    .findOne({ riderEmail, parcelId });

  if (existing) {
    return res.status(200).send({
      message: "Rider earning already exists",
      existing: true,
    });
  }

  const newEarning = {
    ...req.body,
    amount: Number(amount || 0),
    status: req.body.status || "unpaid",
    createdAt: now(),
    updatedAt: now(),
  };

  const result = await collections.riderEarnings().insertOne(newEarning);

  res.status(201).send({
    message: "Rider earning saved successfully",
    insertedId: result.insertedId,
  });
};

export const getRiderEarningsByEmail = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  await isRequesterAuthorized(req.decoded.email, email);

  const earnings = await collections
    .riderEarnings()
    .find({ riderEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  res.send(earnings.map(serializeDoc));
};

export const getRiderEarningsSummary = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  await isRequesterAuthorized(req.decoded.email, email);

  const earnings = await collections.riderEarnings().find({ riderEmail: email }).toArray();

  const totalEarnings = earnings.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );
  const paidEarnings = earnings
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const unpaidEarnings = earnings
    .filter((item) => item.status === "unpaid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  res.send({
    totalEarnings,
    paidEarnings,
    unpaidEarnings,
    totalRecords: earnings.length,
  });
};
