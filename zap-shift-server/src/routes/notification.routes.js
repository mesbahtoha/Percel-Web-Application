import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyFBToken);

router.get("/notifications", getNotifications);
router.get("/notifications/unread-count", getUnreadCount);
router.get("/notification/unread-count", getUnreadCount);
router.patch("/notifications/read-all", markAllNotificationsRead);
router.patch("/notifications/:id/read", markNotificationRead);

export default router;
