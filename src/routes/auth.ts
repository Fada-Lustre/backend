import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import db from "../db";
import { env } from "../env";
import { validate } from "../middleware/validate";
import { RegisterSchema, LoginSchema, ForgotPasswordSchema } from "../schemas/auth";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validate(RegisterSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, email, password, service_type } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const rows = await db.query(
        `INSERT INTO users (first_name, email, password_hash, service_type)
         VALUES ($1, $2, $3, $4)
         RETURNING id, first_name, email`,
        [first_name, email, hashedPassword, service_type]
      );

      const user: any = rows[0];

      const token = sign(
        { id: user.id, email: user.email, role: "customer" },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        token,
        refresh_token: refreshToken,
      });
    } catch (err: any) {
      if (err?.code === "23505") {
        res.status(409).json({ error: { code: "DUPLICATE", message: "Email already exists" } });
        return;
      }
      console.error("Registration error:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Registration failed" } });
    }
  }
);

authRouter.post(
  "/login",
  validate(LoginSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const rows = await db.query(
        "SELECT id, first_name, email, password_hash, role FROM users WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        res.status(401).json({ error: { code: "AUTH_FAILED", message: "Invalid credentials" } });
        return;
      }

      const user: any = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash.toString());

      if (!isMatch) {
        res.status(401).json({ error: { code: "AUTH_FAILED", message: "Invalid credentials" } });
        return;
      }

      const token = sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = sign(
        { id: user.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
      );

      res.json({
        id: user.id,
        first_name: user.first_name,
        token,
        refresh_token: refreshToken,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: { code: "SERVER_ERROR", message: "Login failed" } });
    }
  }
);

authRouter.post(
  "/forgot-password",
  validate(ForgotPasswordSchema),
  async (_req: Request, res: Response) => {
    // Intentionally vague response to prevent user enumeration
    res.json({ message: "If an account exists with this email, a reset link has been sent." });
  }
);

authRouter.post("/refresh", async (req: Request, res: Response): Promise<void> => {
  // Phase 2: full refresh token implementation with DB-backed token store
  res.status(501).json({ error: { code: "NOT_IMPLEMENTED", message: "Token refresh not yet implemented" } });
});

export default authRouter;
