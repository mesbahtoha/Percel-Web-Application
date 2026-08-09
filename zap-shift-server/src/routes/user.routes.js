import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  createUser,
  updateLastLogin,
  updateProfile,
  getUserProfile,
  getUserRole,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/", createUser);
router.patch("/last-login", verifyFBToken, updateLastLogin);
router.patch("/profile", verifyFBToken, updateProfile);
router.get("/profile/:email", verifyFBToken, getUserProfile);
router.get("/role/:email", getUserRole);

export default router;
