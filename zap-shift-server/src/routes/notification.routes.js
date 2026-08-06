import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  getRiderNotifications,
  getRiderUnreadCount,
  getUserUnreadCount,
  markAllRiderNotificationsRead,
  markRiderNotificationRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyFBToken);

router.get("/notifications", getRiderNotifications);
router.get("/notifications/unread-count", getRiderUnreadCount);
router.get("/notification/unread-count", getUserUnreadCount);
router.patch("/notifications/read-all", markAllRiderNotificationsRead);
router.patch("/notifications/:id/read", markRiderNotificationRead);

export default router;
