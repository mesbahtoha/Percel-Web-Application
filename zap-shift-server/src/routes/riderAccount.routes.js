import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  createRiderAccount,
  getRiderAccount,
  updateRiderProfile,
} from "../controllers/riderAccount.controller.js";

const router = Router();

router.post("/", verifyFBToken, createRiderAccount);
router.get("/:email", verifyFBToken, getRiderAccount);
router.patch("/profile", verifyFBToken, updateRiderProfile);

export default router;
