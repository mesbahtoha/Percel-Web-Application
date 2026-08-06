import { ObjectId } from "mongodb";
import { ApiError } from "./ApiError.js";
import { env } from "../config/env.js";

export const now = () => new Date();

export const toObjectId = (id) => new ObjectId(id);

export const isValidObjectId = (id) => ObjectId.isValid(id);

export const normalizeStatus = (value = "") =>
  String(value).trim().toLowerCase();

export const convertTakaToUsdCents = (taka) => {
  const numericTaka = Number(taka);
  return Math.round((numericTaka / env.TAKA_PER_USD) * 100);
};

export const generateTrackingId = () =>
  `TRK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

export const serializeDoc = (doc) => {
  if (!doc) return doc;
  return { ...doc, _id: doc._id?.toString?.() || doc._id };
};

export const requireEmail = (email) => {
  if (!email) throw new ApiError(400, "Email is required");
};

export const requireObjectId = (id, label) => {
  if (!isValidObjectId(id)) throw new ApiError(400, `Invalid ${label}`);
};
