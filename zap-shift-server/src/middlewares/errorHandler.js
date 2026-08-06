import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, res) => {
  res.status(404).send({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  if (status >= 500) {
    console.error("❌ Server error:", err);
  }

  res.status(status).send({
    message: err.message || "Internal server error",
    ...(err.cause?.message ? { error: err.cause.message } : {}),
  });
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
