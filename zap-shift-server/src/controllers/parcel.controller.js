import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notification.service.js";
import {
  now,
  requireEmail,
  requireObjectId,
  toObjectId,
  generateTrackingId,
} from "../utils/helpers.js";

export const createParcel = async (req, res) => {
  const parcelData = req.body;

  if (req.decoded.email !== parcelData.userEmail) {
    throw new ApiError(403, "forbidden access");
  }

  const newParcel = {
    ...parcelData,
    trackingId: parcelData.trackingId || generateTrackingId(),
    paymentStatus: "unpaid",
    deliveryStatus: parcelData.deliveryStatus || "pending",
    transactionId: null,
    paidAt: null,
    assignedRiderId: null,
    assignedRiderEmail: null,
    assignedRiderName: null,
    cashReceivedByAdmin: false,
    parcelCurrentStatus: parcelData.deliveryStatus || "pending",
    createdAt: now(),
    updatedAt: now(),
  };

  const result = await collections.parcels().insertOne(newParcel);

  await createNotification({
    type: "parcel_order",
    title: "New parcel order",
    message: `New parcel order placed by ${parcelData.userEmail}`,
    recipientRole: "admin",
    relatedId: result.insertedId,
    relatedCollection: "parcels",
    meta: { trackingId: newParcel.trackingId },
  });

  await createNotification({
    type: "parcel_booked",
    title: "Parcel booked successfully",
    message: `Your parcel ${newParcel.trackingId} has been booked. Please complete the payment to continue.`,
    recipientRole: "user",
    recipientEmail: newParcel.userEmail,
    relatedId: result.insertedId,
    relatedCollection: "parcels",
    meta: { trackingId: newParcel.trackingId },
  });

  res.status(201).json({
    message: "Parcel saved successfully",
    insertedId: result.insertedId,
    trackingId: newParcel.trackingId,
  });
};

export const getAllParcels = async (req, res) => {
  const parcels = await collections.parcels()
    .find()
    .sort({ createdAt: -1 })
    .toArray();
  res.json(parcels);
};

export const getParcelsByUser = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const parcels = await collections.parcels()
    .find({ userEmail: email })
    .sort({ createdAt: -1 })
    .toArray();

  res.json(parcels);
};

export const getParcelById = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "parcel id");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(id) });

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  const isOwner = req.decoded.email === parcel.userEmail;
  const user = await collections.users().findOne({ email: req.decoded.email });
  const isAdmin = user?.role === "admin";
  const isAssignedRider = req.decoded.email === parcel.assignedRiderEmail;

  if (!isOwner && !isAdmin && !isAssignedRider) {
    throw new ApiError(403, "forbidden access");
  }

  res.json(parcel);
};

export const deleteParcel = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "parcel id");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(id) });

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (req.decoded.email !== parcel.userEmail) {
    throw new ApiError(403, "forbidden access");
  }

  const result = await collections.parcels().deleteOne({ _id: toObjectId(id) });
  res.json({ deletedCount: result.deletedCount });
};
