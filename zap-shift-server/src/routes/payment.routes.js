import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  createPaymentIntent,
  savePayment,
  getPaymentsByUser,
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-payment-intent", verifyFBToken, createPaymentIntent);
router.post("/payments", verifyFBToken, savePayment);
router.get("/payments/:email", verifyFBToken, getPaymentsByUser);

export default router;
