import rateLimit from "express-rate-limit";

const isTest = process.env.NODE_ENV === "test";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { code: "RATE_LIMIT", message: "Too many authentication attempts, try again later" },
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: { code: "RATE_LIMIT", message: "Too many requests, try again later" },
});
