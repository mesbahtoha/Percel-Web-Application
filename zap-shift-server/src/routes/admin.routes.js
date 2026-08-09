import { Router } from "express";
import { verifyFBToken, verifyAdmin } from "../middlewares/auth.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require a verified Firebase token AND admin role
router.use(verifyFBToken, verifyAdmin);

router.get("/overview", adminController.getOverview);
router.get("/dashboard-overview", adminController.getDashboardOverview);

router.get("/users", adminController.getAdminUsers);
router.get("/users/:id", adminController.getAdminUserById);
router.patch("/users/:id/role", adminController.updateUserRole);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.delete("/users/:id", adminController.deleteUserAccount);

router.get("/orders", adminController.getAdminOrders);
router.get("/orders/:id", adminController.getAdminOrderById);

router.get("/parcel-tracking", adminController.getAdminParcelTracking);
router.get("/parcel-tracking/:id", adminController.getAdminParcelTrackingById);
router.patch("/parcel-tracking/:id/status", adminController.updateParcelTrackingStatus);

router.get("/payments", adminController.getAdminPayments);
router.patch("/payments/:id/receive", adminController.receiveAdminPayment);

router.get("/riders", adminController.getAdminRiders);
router.get("/riders/available", adminController.getAvailableRiders);
router.get("/riders/:id", adminController.getAdminRiderById);
router.patch("/riders/:id/approval", adminController.updateRiderApproval);

router.get("/parcels/unassigned", adminController.getUnassignedParcels);

router.get("/rider-payments", adminController.getRiderPayments);
router.patch("/rider-payments/pay", adminController.payRider);

router.get("/rider-task-updates", adminController.getRiderTaskUpdates);

router.get("/notifications", adminController.getAdminNotifications);
router.patch("/notifications/:id/read", adminController.markAdminNotificationRead);

export default router;
