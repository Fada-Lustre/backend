import * as process from "process";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

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
});

export const env = EnvironmentVariableSchema.parse(process.env);
