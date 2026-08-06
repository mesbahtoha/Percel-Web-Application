import { Router } from "express";
import { verifyFBToken } from "../middlewares/auth.js";
import {
  createParcel,
  getAllParcels,
  getParcelsByUser,
  getParcelById,
  deleteParcel,
} from "../controllers/parcel.controller.js";

const router = Router();

router.post("/", verifyFBToken, createParcel);
router.get("/", getAllParcels);
router.get("/user/:email", verifyFBToken, getParcelsByUser);
router.get("/:id", verifyFBToken, getParcelById);
router.delete("/:id", verifyFBToken, deleteParcel);

export default router;
