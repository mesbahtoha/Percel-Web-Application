import { collections } from "../config/db.js";
import { createNotification } from "./notification.service.js";
import { now } from "../utils/helpers.js";

export const createRiderTask = async ({ parcel, rider, adminEmail, adminMessage = "" }) => {
  const parcelId = parcel._id.toString();

  const newTask = {
    parcelId,
    trackingId: parcel.trackingId || "",
    riderId: rider._id.toString(),
    riderEmail: rider.email,
    riderName: rider.name || "",
    riderPhone: rider.phone || "",
    customerName: parcel.senderName || "",
    customerPhone: parcel.senderPhone || "",
    pickupLocation: parcel.senderCenter || parcel.senderAddress || "",
    deliveryLocation: parcel.receiverCenter || parcel.receiverAddress || "",
    senderInfo: {
      name: parcel.senderName || "",
      phone: parcel.senderPhone || "",
      address: parcel.senderAddress || "",
      center: parcel.senderCenter || "",
    },
    receiverInfo: {
      name: parcel.receiverName || "",
      phone: parcel.receiverPhone || "",
      address: parcel.receiverAddress || "",
      center: parcel.receiverCenter || "",
    },
    parcelInfo: {
      type: parcel.parcelType || parcel.type || "",
      weight: parcel.weight || "",
      cost: Number(parcel.cost || parcel.amountTaka || 0),
      paymentStatus: parcel.paymentStatus || "unpaid",
    },
    adminMessage,
    status: "assigned",
    assignedBy: adminEmail,
    assignedAt: now(),
    updatedAt: now(),
    completedAt: null,
  };

  const result = await collections.riderTasks().insertOne(newTask);

  await collections.parcels().updateOne(
    { _id: parcel._id },
    {
      $set: {
        assignedRiderId: rider._id.toString(),
        assignedRiderEmail: rider.email,
        assignedRiderName: rider.name || "",
        deliveryStatus: "assigned",
        parcelCurrentStatus: "assigned",
        updatedAt: now(),
      },
    }
  );

  await collections.riderAccounts().updateOne(
    { email: rider.email },
    { $set: { workStatus: "busy", updated_at: now() } }
  );

  await createNotification({
    type: "rider_assign",
    title: "Rider assigned",
    message: `Parcel assigned to rider ${rider.email}`,
    recipientRole: "admin",
    relatedId: parcelId,
    relatedCollection: "parcels",
    meta: { riderEmail: rider.email },
  });

  await createNotification({
    type: "rider_task_assigned",
    title: "New delivery task assigned",
    message: `You have been assigned parcel ${parcel.trackingId || parcelId}`,
    recipientRole: "rider",
    recipientEmail: rider.email,
    relatedId: parcelId,
    relatedCollection: "riderTasks",
    meta: {
      parcelId,
      trackingId: parcel.trackingId || "",
      senderName: parcel.senderName || "",
      receiverName: parcel.receiverName || "",
      adminMessage,
    },
  });

  return result;
};
