import { ObjectId } from "mongodb";
import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { createNotification } from "../services/notification.service.js";
import {
  now,
  requireObjectId,
  toObjectId,
  isValidObjectId,
  normalizeStatus,
  serializeDoc,
} from "../utils/helpers.js";

export const getOverview = async (req, res) => {
  const [totalUsers, totalRiders, totalParcels, totalPayments] = await Promise.all([
    collections.users().countDocuments({ role: { $ne: "admin" } }),
    collections.riderAccounts().countDocuments({}),
    collections.parcels().countDocuments({}),
    collections.payments().countDocuments({}),
  ]);

  const [pendingParcels, completedParcels, pendingRiders, availableRiders, busyRiders, unpaidOrders] =
    await Promise.all([
      collections.parcels().countDocuments({ deliveryStatus: "pending" }),
      collections.parcels().countDocuments({ deliveryStatus: "completed" }),
      collections.riderAccounts().countDocuments({ approvalStatus: "pending" }),
      collections
        .riderAccounts()
        .countDocuments({ approvalStatus: "approved", workStatus: "free" }),
      collections
        .riderAccounts()
        .countDocuments({ approvalStatus: "approved", workStatus: "busy" }),
      collections.parcels().countDocuments({ paymentStatus: "unpaid" }),
    ]);

  const successfulPayments = await collections
    .payments()
    .find({ status: "succeeded" })
    .toArray();
  const totalCashIn = successfulPayments.reduce(
    (sum, payment) => sum + Number(payment.amountTaka || 0),
    0
  );

  const paidRiderEarnings = await collections
    .riderEarnings()
    .find({ status: "paid" })
    .toArray();
  const totalCashOut = paidRiderEarnings.reduce(
    (sum, earning) => sum + Number(earning.amount || 0),
    0
  );

  const recentNotifications = await collections
    .notifications()
    .find({ recipientRole: "admin" })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();

  res.send({
    stats: {
      totalUsers,
      totalRiders,
      totalParcels,
      totalPayments,
      pendingParcels,
      completedParcels,
      pendingRiders,
      availableRiders,
      busyRiders,
      unpaidOrders,
      totalCashIn,
      totalCashOut,
    },
    recentNotifications,
  });
};

export const getAdminUsers = async (req, res) => {
  const search = req.query.search || "";

  const query = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
        role: { $ne: "admin" },
      }
    : { role: { $ne: "admin" } };

  const users = await collections.users()
    .find(query)
    .sort({ created_at: -1 })
    .toArray();

  const enrichedUsers = await Promise.all(
    users.map(async (user) => {
      const totalParcels = await collections
        .parcels()
        .countDocuments({ userEmail: user.email });
      return {
        ...serializeDoc(user),
        totalParcels,
        accountStatus: user.status || "active",
      };
    })
  );

  res.send(enrichedUsers);
};

export const getAdminUserById = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "user id");

  const user = await collections.users().findOne({ _id: toObjectId(id) });
  if (!user) throw new ApiError(404, "User not found");

  const [parcelHistory, paymentHistory] = await Promise.all([
    collections.parcels()
      .find({ userEmail: user.email })
      .sort({ createdAt: -1 })
      .toArray(),
    collections.payments()
      .find({ email: user.email })
      .sort({ paidAt: -1 })
      .toArray(),
  ]);

  res.send({
    user: serializeDoc(user),
    parcelHistory: parcelHistory.map(serializeDoc),
    paymentHistory: paymentHistory.map(serializeDoc),
  });
};

export const getAdminOrders = async (req, res) => {
  const search = req.query.search || "";
  const status = req.query.status || "";
  const query = {};

  if (search) {
    query.$or = [
      { trackingId: { $regex: search, $options: "i" } },
      { senderName: { $regex: search, $options: "i" } },
      { receiverName: { $regex: search, $options: "i" } },
      { userEmail: { $regex: search, $options: "i" } },
    ];
  }

  if (status) query.deliveryStatus = normalizeStatus(status);

  const orders = await collections.parcels()
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  res.send(orders.map(serializeDoc));
};

export const getAdminOrderById = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "order id");

  const order = await collections.parcels().findOne({ _id: toObjectId(id) });
  if (!order) throw new ApiError(404, "Order not found");

  const payment = order.transactionId
    ? await collections.payments().findOne({ transactionId: order.transactionId })
    : null;

  res.send({ order: serializeDoc(order), payment: serializeDoc(payment) });
};

export const getAdminParcelTracking = async (req, res) => {
  const search = req.query.search || "";
  const query = search
    ? {
        $or: [
          { trackingId: { $regex: search, $options: "i" } },
          { senderName: { $regex: search, $options: "i" } },
          { receiverName: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const parcels = await collections.parcels()
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  res.send(parcels.map(serializeDoc));
};

export const getAdminParcelTrackingById = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "parcel id");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(id) });
  if (!parcel) throw new ApiError(404, "Parcel not found");

  const riderTask = await collections.riderTasks().findOne({ parcelId: id });
  res.send({ parcel: serializeDoc(parcel), riderTask: serializeDoc(riderTask) });
};

export const updateParcelTrackingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  requireObjectId(id, "parcel id");

  if (!status) throw new ApiError(400, "status is required");

  const parcel = await collections.parcels().findOne({ _id: toObjectId(id) });
  if (!parcel) throw new ApiError(404, "Parcel not found");

  const normalized = normalizeStatus(status);

  await collections.parcels().updateOne(
    { _id: toObjectId(id) },
    {
      $set: {
        deliveryStatus: normalized,
        parcelCurrentStatus: normalized,
        updatedAt: now(),
      },
    }
  );

  if (parcel.assignedRiderEmail) {
    await collections.riderTasks().updateOne(
      { parcelId: id, riderEmail: parcel.assignedRiderEmail },
      {
        $set: {
          status: normalized,
          updatedAt: now(),
          ...(normalized === "completed" ? { completedAt: now() } : {}),
        },
      }
    );
  }

  if (normalized === "completed" && parcel.assignedRiderEmail) {
    await collections.riderAccounts().updateOne(
      { email: parcel.assignedRiderEmail },
      { $set: { workStatus: "free", updated_at: now() } }
    );
  }

  await createNotification({
    type: "parcel_status_update",
    title: "Parcel status updated",
    message: `Parcel ${parcel.trackingId || id} updated to ${normalized}`,
    recipientRole: "admin",
    relatedId: id,
    relatedCollection: "parcels",
    meta: { status: normalized },
  });

  res.send({ message: "Parcel status updated successfully" });
};

export const getAdminPayments = async (req, res) => {
  const payments = await collections.payments()
    .find()
    .sort({ paidAt: -1 })
    .toArray();

  const items = await Promise.all(
    payments.map(async (payment) => {
      const parcel = isValidObjectId(payment.parcelId)
        ? await collections.parcels().findOne({ _id: toObjectId(payment.parcelId) })
        : null;
      return { ...serializeDoc(payment), parcel: serializeDoc(parcel) };
    })
  );

  const totalCashIn = payments.reduce((sum, p) => sum + Number(p.amountTaka || 0), 0);
  const paidCount = payments.filter((p) => p.status === "succeeded").length;
  const pendingAdminReceive = payments.filter(
    (p) => p.cashInStatus === "pending_admin_receive"
  ).length;

  res.send({
    summary: { totalCashIn, paidCount, pendingAdminReceive },
    payments: items,
  });
};

export const receiveAdminPayment = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "payment id");

  const payment = await collections.payments().findOne({ _id: toObjectId(id) });
  if (!payment) throw new ApiError(404, "Payment not found");

  await collections.payments().updateOne(
    { _id: toObjectId(id) },
    { $set: { cashInStatus: "received_by_admin", cashReceivedAt: now() } }
  );

  if (payment.parcelId && isValidObjectId(payment.parcelId)) {
    await collections.parcels().updateOne(
      { _id: toObjectId(payment.parcelId) },
      { $set: { cashReceivedByAdmin: true, updatedAt: now() } }
    );
  }

  res.send({ message: "Payment received successfully by admin" });
};

export const getAdminRiders = async (req, res) => {
  const search = req.query.search || "";
  const approvalStatus = req.query.approvalStatus || "";
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  if (approvalStatus) query.approvalStatus = normalizeStatus(approvalStatus);

  const riders = await collections.riderAccounts()
    .find(query)
    .sort({ created_at: -1 })
    .toArray();

  res.send(riders.map(serializeDoc));
};

export const getUnassignedParcels = async (req, res) => {
  const parcels = await collections.parcels()
    .find({
      $and: [
        {
          $or: [
            { assignedRiderId: null },
            { assignedRiderId: { $exists: false } },
            { assignedRiderId: "" },
          ],
        },
        {
          $or: [
            { assignedRiderEmail: null },
            { assignedRiderEmail: { $exists: false } },
            { assignedRiderEmail: "" },
          ],
        },
        { deliveryStatus: { $in: ["pending", "unassigned"] } },
      ],
    })
    .sort({ createdAt: -1 })
    .toArray();

  res.send(parcels.map(serializeDoc));
};

export const getAvailableRiders = async (req, res) => {
  const riders = await collections
    .riderAccounts()
    .find({ approvalStatus: "approved", workStatus: "free" })
    .toArray();

  res.send(riders);
};

export const getAdminRiderById = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "rider id");

  const rider = await collections.riderAccounts().findOne({ _id: toObjectId(id) });
  if (!rider) throw new ApiError(404, "Rider not found");

  const [tasks, earnings] = await Promise.all([
    collections.riderTasks()
      .find({ riderEmail: rider.email })
      .sort({ assignedAt: -1 })
      .toArray(),
    collections.riderEarnings()
      .find({ riderEmail: rider.email })
      .sort({ createdAt: -1 })
      .toArray(),
  ]);

  res.send({
    rider: serializeDoc(rider),
    tasks: tasks.map(serializeDoc),
    earnings: earnings.map(serializeDoc),
  });
};

export const updateRiderApproval = async (req, res) => {
  const { id } = req.params;
  const { approvalStatus } = req.body;

  requireObjectId(id, "rider id");

  const normalized = normalizeStatus(approvalStatus);
  if (!["approved", "declined", "pending"].includes(normalized)) {
    throw new ApiError(400, "Invalid approvalStatus");
  }

  const rider = await collections.riderAccounts().findOne({ _id: toObjectId(id) });
  if (!rider) throw new ApiError(404, "Rider not found");

  const updateDoc = { approvalStatus: normalized, updated_at: now() };
  if (normalized === "approved") updateDoc.workStatus = "free";

  await collections.riderAccounts().updateOne({ _id: toObjectId(id) }, { $set: updateDoc });

  await createNotification({
    type: "rider_approval",
    title: "Rider approval updated",
    message: `Rider ${rider.email} status changed to ${normalized}`,
    recipientRole: "admin",
    relatedId: id,
    relatedCollection: "riderAccounts",
    meta: { approvalStatus: normalized },
  });

  res.send({ message: "Rider approval updated successfully" });
};

export const getRiderPayments = async (req, res) => {
  const riders = await collections.riderAccounts().find({}).toArray();

  const result = await Promise.all(
    riders.map(async (rider) => {
      const earnings = await collections
        .riderEarnings()
        .find({ riderEmail: rider.email })
        .toArray();
      const totalPayment = earnings.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0
      );
      const paidAmount = earnings
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

      return {
        riderId: rider._id.toString(),
        riderName: rider.name || "",
        riderEmail: rider.email,
        completedParcels: earnings.length,
        totalPayment,
        paidAmount,
        dueAmount: totalPayment - paidAmount,
        approvalStatus: rider.approvalStatus,
        workStatus: rider.workStatus,
      };
    })
  );

  res.send(result);
};

export const payRider = async (req, res) => {
  const { riderEmail } = req.body;
  if (!riderEmail) throw new ApiError(400, "riderEmail is required");

  const unpaidEarnings = await collections
    .riderEarnings()
    .find({ riderEmail, status: "unpaid" })
    .toArray();

  if (!unpaidEarnings.length) throw new ApiError(400, "No unpaid earnings found");

  const totalPaidNow = unpaidEarnings.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  await collections.riderEarnings().updateMany(
    { riderEmail, status: "unpaid" },
    { $set: { status: "paid", paidAt: now(), updatedAt: now() } }
  );

  await createNotification({
    type: "cash_out",
    title: "Cash out message",
    message: `Cash out completed for rider ${riderEmail}`,
    recipientRole: "admin",
    relatedCollection: "riderEarnings",
    meta: { riderEmail, totalPaidNow },
  });

  res.send({ message: "Rider payment completed successfully", totalPaidNow });
};

export const getRiderTaskUpdates = async (req, res) => {
  const tasks = await collections.riderTasks()
    .find()
    .sort({ updatedAt: -1 })
    .toArray();

  const enrichedTasks = await Promise.all(
    tasks.map(async (task) => {
      const rider = await collections
        .riderAccounts()
        .findOne({ email: task.riderEmail });
      const parcel =
        task.parcelId && ObjectId.isValid(task.parcelId)
          ? await collections.parcels().findOne({ _id: toObjectId(task.parcelId) })
          : null;
      return {
        ...task,
        availability: rider?.workStatus || "unknown",
        parcelName: parcel?.parcelName || parcel?.trackingId || "",
      };
    })
  );

  res.send(enrichedTasks);
};

export const getAdminNotifications = async (req, res) => {
  const notifications = await collections
    .notifications()
    .find({ recipientRole: "admin" })
    .sort({ createdAt: -1 })
    .toArray();

  res.send(notifications.map(serializeDoc));
};

export const markAdminNotificationRead = async (req, res) => {
  const { id } = req.params;

  requireObjectId(id, "notification id");

  await collections.notifications().updateOne(
    { _id: toObjectId(id) },
    { $set: { isRead: true, readAt: now() } }
  );

  res.send({ message: "Notification marked as read" });
};

export const getDashboardOverview = async (req, res) => {
  const [totalUsers, totalRiders, totalParcels, completedParcels, pendingParcels, pendingRiders, availableRiders, unpaidOrders] =
    await Promise.all([
      collections.users().countDocuments({ role: { $ne: "admin" } }),
      collections.riderAccounts().countDocuments(),
      collections.parcels().countDocuments(),
      collections.parcels().countDocuments({ deliveryStatus: "completed" }),
      collections.parcels().countDocuments({ deliveryStatus: "pending" }),
      collections.riderAccounts().countDocuments({ approvalStatus: "pending" }),
      collections
        .riderAccounts()
        .countDocuments({ approvalStatus: "approved", workStatus: "free" }),
      collections.parcels().countDocuments({ paymentStatus: "unpaid" }),
    ]);

  const payments = await collections
    .payments()
    .find({ status: "succeeded" })
    .toArray();
  const totalCashIn = payments.reduce(
    (sum, item) => sum + Number(item.amountTaka || 0),
    0
  );

  const riderPayments = await collections
    .riderEarnings()
    .find({ status: "paid" })
    .toArray();
  const totalCashOut = riderPayments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const notifications = await collections
    .notifications()
    .find({ recipientRole: "admin" })
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();

  // Chart: parcel delivery status distribution (bar chart)
  const statusNames = [
    "pending",
    "assigned",
    "taken",
    "shifted",
    "out for delivery",
    "completed",
    "cancelled",
  ];
  const statusCounts = await Promise.all(
    statusNames.map((status) =>
      collections.parcels().countDocuments({ deliveryStatus: status })
    )
  );
  const deliveryStatusCounts = statusNames
    .map((name, i) => ({
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      count: statusCounts[i],
    }))
    .filter((item) => item.count > 0);

  // Chart: cash-in trend for the last 7 days (line chart)
  const dayLabels = [];
  const dayMap = new Map();
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    dayLabels.push({
      date: key,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
    dayMap.set(key, 0);
  }
  for (const payment of payments) {
    const paidAt = payment.paidAt || payment.createdAt;
    if (!paidAt) continue;
    const d = new Date(paidAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = d.toISOString().split("T")[0];
    if (dayMap.has(key)) {
      dayMap.set(key, dayMap.get(key) + Number(payment.amountTaka || 0));
    }
  }
  const cashInTrend = dayLabels.map(({ date, label }) => ({
    date,
    label,
    amount: dayMap.get(date) || 0,
  }));

  res.send({
    stats: {
      totalUsers,
      totalRiders,
      totalParcels,
      completedParcels,
      pendingParcels,
      pendingRiders,
      availableRiders,
      unpaidOrders,
      totalCashIn,
      totalCashOut,
    },
    notifications,
    chartData: {
      deliveryStatusCounts,
      cashInTrend,
    },
  });
};
