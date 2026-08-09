import { collections } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import {
  now,
  requireObjectId,
  toObjectId,
  serializeDoc,
} from "../utils/helpers.js";

const recipientRoleFromRequest = (req) =>
  req.baseUrl?.includes("/rider") ? "rider" : "user";

const buildRecipientQuery = (req, email) => {
  const role = recipientRoleFromRequest(req);
  if (role === "rider") {
    return { recipientRole: "rider", recipientEmail: email };
  }
  return { recipientEmail: email };
};

export const getNotifications = async (req, res) => {
  const email = req.decoded?.email;
  if (!email) throw new ApiError(401, "unauthorized access");

  const notifications = await collections
    .notifications()
    .find(buildRecipientQuery(req, email))
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  res.send(notifications.map(serializeDoc));
};

export const getUnreadCount = async (req, res) => {
  const email = req.decoded?.email;
  if (!email) throw new ApiError(401, "unauthorized access");

  const count = await collections.notifications().countDocuments({
    ...buildRecipientQuery(req, email),
    isRead: false,
  });

  res.send({ count });
};

export const markAllNotificationsRead = async (req, res) => {
  const email = req.decoded?.email;
  if (!email) throw new ApiError(401, "unauthorized access");

  await collections.notifications().updateMany(
    {
      ...buildRecipientQuery(req, email),
      isRead: false,
    },
    { $set: { isRead: true, readAt: now() } }
  );

  res.send({ message: "All notifications marked as read" });
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.params;
  const email = req.decoded?.email;

  requireObjectId(id, "notification id");

  const notification = await collections
    .notifications()
    .findOne({ _id: toObjectId(id) });
  if (!notification) throw new ApiError(404, "Notification not found");
  if (notification.recipientEmail !== email)
    throw new ApiError(403, "forbidden access");

  await collections.notifications().updateOne(
    { _id: toObjectId(id) },
    { $set: { isRead: true, readAt: now() } }
  );

  res.send({ message: "Notification marked as read" });
};
