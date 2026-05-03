import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "../public/swagger.json";
import { ApplicationError, WrapperError } from "./errors";
import { env } from "./env";
import db from "./db";
import { RegisterRoutes } from "./routes";
import { authLimiter, generalLimiter } from "./middleware/rateLimiter";
import { ZodError } from "zod";
import webhookRouter from "./controllers/WebhookController";
import cleanerBookingImageRouter from "./controllers/CleanerBookingImageRoute";
import adminServiceImageRouter from "./controllers/AdminServiceImageRoute";
import { customerProfileImageRouter, cleanerProfileImageRouter, adminProfileImageRouter } from "./controllers/ProfileImageRoute";
import adminBlogImageRouter from "./controllers/AdminBlogImageRoute";
import cleanerApplicationImageRouter from "./controllers/CleanerApplicationImageRoute";

const app = express();
const PORT = env.PORT;

app.use("/v1/payments", express.raw({ type: "application/json" }), webhookRouter);
app.use("/v1/cleaner/bookings", cleanerBookingImageRouter);
app.use("/v1/admin/services", adminServiceImageRouter);
app.use("/v1/customer/profile", customerProfileImageRouter);
app.use("/v1/cleaner/profile", cleanerProfileImageRouter);
app.use("/v1/admin/profile", adminProfileImageRouter);
app.use("/v1/admin/blog", adminBlogImageRouter);
app.use("/v1/cleaner-applications", cleanerApplicationImageRouter);

app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin: env.ALLOWED_ORIGINS.includes("*") ? "*" : env.ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/v1/auth", authLimiter);
app.use(generalLimiter);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/ready", async (_req: Request, res: Response) => {
  const connected = await db.isConnected();
  if (connected) {
    res.json({ status: "ready", database: "connected" });
  } else {
    res.status(503).json({ status: "not_ready", database: "disconnected" });
  }
});

app.get("/docs.json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerDoc);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(undefined, {
  swaggerOptions: {
    url: "/docs.json",
  },
  customCssUrl: "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css",
  customJs: [
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js",
    "https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js",
  ],
}));

RegisterRoutes(app);

app.use(
  (err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof ZodError) {
      res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.errors,
      });
    } else if (err instanceof ApplicationError) {
      res.status(err.statusCode).json({ code: err.code, message: err.message });
    } else if (err instanceof WrapperError) {
      res.status(err.statusCode).json({ code: "WRAPPED_ERROR", message: err.message });
    } else if (typeof err === "object" && err !== null && "fields" in err) {
      const tsoaErr = err as { status?: number; fields: unknown };
      res.status(tsoaErr.status ?? 400).json({
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: tsoaErr.fields,
      });
    } else if (typeof err === "object" && err !== null && "error" in err) {
      const wrapped = err as { status?: number; error: unknown };
      res.status(wrapped.status ?? 500).json(wrapped.error);
    } else {
      console.error("Unexpected error:", err);
      res.status(500).json({ code: "SERVER_ERROR", message: "Internal Server Error" });
    }
  }
);

if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Fada Lustre API running on port ${PORT}`);
    console.log(`Swagger UI: http://localhost:${PORT}/docs`);
  });
}

export default app;
