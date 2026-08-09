import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notification.service.js";
import { createPaymentIntentForParcel } from "../services/stripe.service.js";
import {
  now,
  requireEmail,
  requireObjectId,
  toObjectId,
} from "../utils/helpers.js";

export const createPaymentIntent = async (req, res) => {
  const { parcelId } = req.body;

  if (!parcelId) {
    throw new ApiError(400, "parcelId is required");
  }

  requireObjectId(parcelId, "parcelId");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(parcelId) });

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (req.decoded.email !== parcel.userEmail) {
    throw new ApiError(403, "forbidden access");
  }

  if (parcel.paymentStatus === "paid") {
    throw new ApiError(400, "Parcel already paid");
  }

  const takaAmount = Number(parcel.cost || parcel.price || parcel.amountTaka || 0);

  if (!Number.isFinite(takaAmount) || takaAmount <= 0) {
    throw new ApiError(400, "Invalid parcel amount");
  }

  const { paymentIntent, amountInCents, usdAmount } =
    await createPaymentIntentForParcel(parcel);

  if (amountInCents < 50) {
    throw new ApiError(400, "Minimum payable amount is 60 Tk (0.50 USD)");
  }

  res.json({
    clientSecret: paymentIntent.client_secret,
    amountInCents,
    usdAmount,
    takaAmount,
  });
};

export const savePayment = async (req, res) => {
  const paymentInfo = req.body;
  const {
    parcelId,
    transactionId,
    amountTaka,
    amountUsd,
    email,
    paymentMethodId,
    paymentMethod,
    paymentIntentId,
    status,
  } = paymentInfo;

  if (!parcelId || !transactionId) {
    throw new ApiError(400, "parcelId and transactionId are required");
  }

  requireObjectId(parcelId, "parcelId");

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const existingPayment = await collections.payments().findOne({ transactionId });

  if (existingPayment) {
    return res.status(200).json({ message: "Payment already saved", existing: true });
  }

  const parcel = await collections.parcels().findOne({ _id: toObjectId(parcelId) });

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (req.decoded.email !== parcel.userEmail) {
    throw new ApiError(403, "forbidden access");
  }

  const paidAt = now();

  const paymentDoc = {
    parcelId,
    transactionId,
    amountTaka: Number(amountTaka),
    amountUsd: Number(amountUsd),
    email,
    paymentMethodId,
    paymentMethod: paymentMethod || "Card",
    paymentIntentId,
    status: status || "succeeded",
    cashInStatus: "pending_admin_receive",
    paidAt,
    createdAt: now(),
    parcelName: parcel?.parcelName || "",
  };

  const paymentResult = await collections.payments().insertOne(paymentDoc);

  const updateResult = await collections.parcels().updateOne(
    { _id: toObjectId(parcelId) },
    {
      $set: {
        paymentStatus: "paid",
        transactionId,
        amountTaka: Number(amountTaka),
        amountUsd: Number(amountUsd),
        paidAt,
        updatedAt: now(),
      },
    }
  );

  await createNotification({
    type: "cash_in",
    title: "Cash in message",
    message: `Payment received from user ${email}`,
    recipientRole: "admin",
    relatedId: parcelId,
    relatedCollection: "payments",
    meta: { transactionId, amountTaka: Number(amountTaka) },
  });

  await createNotification({
    type: "payment_success",
    title: "Payment successful",
    message: `Your payment of ৳${Number(amountTaka)} for parcel ${parcel.parcelName || parcel.trackingId} was successful.`,
    recipientRole: "user",
    recipientEmail: email,
    relatedId: parcelId,
    relatedCollection: "payments",
    meta: {
      transactionId,
      trackingId: parcel.trackingId || "",
      amountTaka: Number(amountTaka),
    },
  });

  res.status(201).json({
    message: "Payment saved and parcel marked as paid",
    paymentInsertResult: paymentResult,
    parcelUpdateResult: updateResult,
  });
};

export const getPaymentsByUser = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  if (req.decoded.email !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const payments = await collections.payments()
    .find({ email })
    .sort({ paidAt: -1 })
    .toArray();

  res.json(payments);
};
