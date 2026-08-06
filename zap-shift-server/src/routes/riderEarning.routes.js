import { Router } from "express";
import { verifyFBToken, verifyAdmin } from "../middlewares/auth.js";
import {
  createRiderEarning,
  getRiderEarningsByEmail,
  getRiderEarningsSummary,
} from "../controllers/riderEarning.controller.js";

const router = Router();

router.post("/rider-earnings", verifyFBToken, verifyAdmin, createRiderEarning);
router.get("/rider-earnings/:email", verifyFBToken, getRiderEarningsByEmail);
router.get("/rider-earnings-summary/:email", verifyFBToken, getRiderEarningsSummary);

export default router;
