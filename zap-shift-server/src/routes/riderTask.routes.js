import { Router } from "express";
import {
  verifyFBToken,
  verifyAdmin,
  verifyRiderOrAdmin,
} from "../middlewares/auth.js";
import {
  assignRiderToParcel,
  createRiderTaskHandler,
  getAllRiderTasks,
  getRiderTasksByEmail,
  updateRiderTaskStatus,
} from "../controllers/riderTask.controller.js";

const router = Router();

router.patch("/admin/parcels/:parcelId/assign-rider", verifyFBToken, verifyAdmin, assignRiderToParcel);
router.post("/rider-tasks", verifyFBToken, verifyAdmin, createRiderTaskHandler);
router.get("/rider-tasks", verifyFBToken, verifyAdmin, getAllRiderTasks);
router.get("/rider-tasks/rider/:email", verifyFBToken, getRiderTasksByEmail);
router.patch("/rider-tasks/:id", verifyFBToken, verifyRiderOrAdmin, updateRiderTaskStatus);

export default router;
