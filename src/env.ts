import * as process from "process";
import * as path from "path";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: process.env.NODE_ENV === "test"
    ? path.resolve(process.cwd(), ".env.test")
    : undefined,
});

const EnvironmentVariableSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DB_USER: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_DB: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().min(1).max(65535).default(5432),
  DB_SSL: z.preprocess((arg) => arg === "true", z.boolean()).default(false),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(""),
  CLOUDINARY_API_KEY: z.string().optional().default(""),
  CLOUDINARY_API_SECRET: z.string().optional().default(""),
  ALLOWED_ORIGINS: z.preprocess(
    (arg) => {
      if (typeof arg === "string" && arg.length > 0) return arg.split(",");
      return process.env.NODE_ENV === "production" ? [] : ["*"];
    },
    z.array(z.string())
  ),
  ENCRYPTION_KEY: z.union([z.string().min(32), z.literal("")]).default(""),
});

export const env = EnvironmentVariableSchema.parse(process.env);
