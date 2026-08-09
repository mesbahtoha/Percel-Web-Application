import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notification.service.js";
import { createRiderTask } from "../services/riderTask.service.js";
import {
  now,
  requireEmail,
  requireObjectId,
  toObjectId,
  normalizeStatus,
  serializeDoc,
} from "../utils/helpers.js";

export const assignRiderToParcel = async (req, res) => {
  const { parcelId } = req.params;
  const { riderId, message } = req.body;

  if (!parcelId || !riderId) {
    throw new ApiError(400, "parcelId and riderId are required");
  }

  requireObjectId(parcelId, "parcelId");
  requireObjectId(riderId, "riderId");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(parcelId) });

  if (!parcel) throw new ApiError(404, "Parcel not found");
  if (parcel.assignedRiderEmail)
    throw new ApiError(400, "Parcel is already assigned to a rider");

  const rider = await collections.riderAccounts().findOne({ _id: toObjectId(riderId) });

  if (!rider) throw new ApiError(404, "Rider not found");
  if (rider.approvalStatus !== "approved")
    throw new ApiError(400, "Rider is not approved");
  if (rider.workStatus === "busy") throw new ApiError(400, "Rider is already busy");

  const result = await createRiderTask({
    parcel,
    rider,
    adminEmail: req.decoded.email,
    adminMessage: message || "",
  });

  res.status(201).send({
    message: "Rider assigned successfully",
    insertedId: result.insertedId,
  });
};

export const createRiderTaskHandler = async (req, res) => {
  const { parcelId, riderEmail } = req.body;

  if (!parcelId || !riderEmail) {
    throw new ApiError(400, "parcelId and riderEmail are required");
  }

  requireObjectId(parcelId, "parcelId");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(parcelId) });
  if (!parcel) throw new ApiError(404, "Parcel not found");

  const rider = await collections.riderAccounts().findOne({ email: riderEmail });
  if (!rider) throw new ApiError(404, "Rider not found");
  if (rider.approvalStatus !== "approved")
    throw new ApiError(400, "Rider is not approved");
  if (rider.workStatus === "busy") throw new ApiError(400, "Rider is already busy");

  const result = await createRiderTask({
    parcel,
    rider,
    adminEmail: req.decoded.email,
    adminMessage: req.body.message || "",
  });

  res.status(201).send({
    message: "Rider task created successfully",
    insertedId: result.insertedId,
  });
};

export const getAllRiderTasks = async (req, res) => {
  const tasks = await collections.riderTasks()
    .find()
    .sort({ assignedAt: -1 })
    .toArray();
  res.send(tasks.map(serializeDoc));
};

export const getRiderTasksByEmail = async (req, res) => {
  const { email } = req.params;

  requireEmail(email);

  const requesterEmail = req.decoded.email;
  const user = await collections.users().findOne({ email: requesterEmail });
  const isAdmin = user?.role === "admin";

  if (!isAdmin && requesterEmail !== email) {
    throw new ApiError(403, "forbidden access");
  }

  const tasks = await collections.riderTasks()
    .find({ riderEmail: email })
    .sort({ assignedAt: -1 })
    .toArray();

  res.send(tasks.map(serializeDoc));
};

export const updateRiderTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status, amount } = req.body;

  requireObjectId(id, "task id");

  if (!status) throw new ApiError(400, "status is required");

  const task = await collections.riderTasks().findOne({ _id: toObjectId(id) });
  if (!task) throw new ApiError(404, "Task not found");

  if (!req.isAdmin && req.decoded.email !== task.riderEmail) {
    throw new ApiError(403, "forbidden access");
  }

  const nextStatus = normalizeStatus(status);

  await collections.riderTasks().updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        status: nextStatus,
        updatedAt: now(),
        ...(nextStatus === "completed" ? { completedAt: now() } : {}),
      },
    }
  );

  const parcelStatusMap = {
    assigned: "assigned",
    taken: "taken",
    shifted: "shifted",
    "out for delivery": "out for delivery",
    completed: "completed",
    cancelled: "cancelled",
  };

  await collections.parcels().updateOne(
    { _id: toObjectId(task.parcelId) },
    {
      $set: {
        deliveryStatus: parcelStatusMap[nextStatus] || nextStatus,
        parcelCurrentStatus: parcelStatusMap[nextStatus] || nextStatus,
        updatedAt: now(),
      },
    }
  );

  if (nextStatus === "completed") {
    await collections.riderAccounts().updateOne(
      { email: task.riderEmail },
      { $set: { workStatus: "free", updated_at: now() } }
    );

    const existingEarning = await collections
      .riderEarnings()
      .findOne({ parcelId: task.parcelId, riderEmail: task.riderEmail });

    if (!existingEarning) {
      await collections.riderEarnings().insertOne({
        riderEmail: task.riderEmail,
        riderName: task.riderName || "",
        parcelId: task.parcelId,
        trackingId: task.trackingId || "",
        amount: Number(amount || 50),
        status: "unpaid",
        createdAt: now(),
        updatedAt: now(),
      });
    }
  }

  if (nextStatus === "cancelled") {
    await collections.riderAccounts().updateOne(
      { email: task.riderEmail },
      { $set: { workStatus: "free", updated_at: now() } }
    );
    await collections.parcels().updateOne(
      { _id: toObjectId(task.parcelId) },
      {
        $set: {
          assignedRiderId: null,
          assignedRiderEmail: null,
          assignedRiderName: null,
          deliveryStatus: "pending",
          parcelCurrentStatus: "pending",
          updatedAt: now(),
        },
      }
    );
  }

  await createNotification({
    type: "rider_task_update",
    title: "Rider task updated",
    message: `Rider updated parcel status to ${nextStatus}`,
    recipientRole: "admin",
    relatedId: task.parcelId,
    relatedCollection: "riderTasks",
    meta: { riderEmail: task.riderEmail, status: nextStatus },
  });

  const parcelForNotif = await collections
    .parcels()
    .findOne({ _id: toObjectId(task.parcelId) });

  if (parcelForNotif?.userEmail) {
    await createNotification({
      type: "parcel_status_update",
      title: "Parcel status updated",
      message: `Your parcel ${parcelForNotif.trackingId || task.trackingId || ""} is now ${nextStatus}.`,
      recipientRole: "user",
      recipientEmail: parcelForNotif.userEmail,
      relatedId: task.parcelId,
      relatedCollection: "riderTasks",
      meta: {
        trackingId: parcelForNotif.trackingId || task.trackingId || "",
        status: nextStatus,
      },
    });
  }

  res.send({ message: "Task status updated successfully" });
};
