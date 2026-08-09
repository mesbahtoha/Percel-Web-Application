import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import parcelRoutes from "./parcel.routes.js";
import paymentRoutes from "./payment.routes.js";
import riderAccountRoutes from "./riderAccount.routes.js";
import riderTaskRoutes from "./riderTask.routes.js";
import riderEarningRoutes from "./riderEarning.routes.js";
import adminRoutes from "./admin.routes.js";
import notificationRoutes from "./notification.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Parcel server is running!");
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/parcels", parcelRoutes);
router.use("/", paymentRoutes);
router.use("/rider-accounts", riderAccountRoutes);
router.use("/", riderTaskRoutes);
router.use("/", riderEarningRoutes);
router.use("/admin", adminRoutes);
router.use("/rider", notificationRoutes);
router.use("/user", notificationRoutes);
router.use("/contact", contactRoutes);

export default router;
