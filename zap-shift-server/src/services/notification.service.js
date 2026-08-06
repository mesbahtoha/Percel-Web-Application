import { collections } from "../config/db.js";
import { now } from "../utils/helpers.js";

export const createNotification = async ({
  type,
  title,
  message,
  recipientRole = "admin",
  recipientEmail = null,
  relatedId = null,
  relatedCollection = null,
  meta = {},
}) => {
  await collections.notifications().insertOne({
    type,
    title,
    message,
    recipientRole,
    recipientEmail,
    relatedId,
    relatedCollection,
    meta,
    isRead: false,
    createdAt: now(),
  });
};
