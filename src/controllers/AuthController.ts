import { Body, Controller, Post, Route, Tags, Response, SuccessResponse } from "tsoa";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import db from "../db";
import { env } from "../env";
import type {
  RegisterRequest, AuthResponse,
  LoginRequest, LoginResponse,
  ForgotPasswordRequest, ForgotPasswordResponse,
} from "../types/auth";
import type { ErrorResponse } from "../types/common";

@Route("v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  /**
   * Register a new customer account.
   * Password must be at least 8 characters and include at least one number.
   */
  @Post("register")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Email already registered")
  public async register(@Body() body: RegisterRequest): Promise<AuthResponse> {
    const passwordValid = body.password.length >= 8 && /\d/.test(body.password);
    if (!passwordValid) {
      this.setStatus(400);
      throw Object.assign(new Error("Invalid password"), {
        error: {
          code: "VALIDATION_ERROR",
          message: "Password must be at least 8 characters and include at least one number",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    let rows: any[];
    try {
      rows = await db.query(
        `INSERT INTO users (first_name, email, password_hash, service_type)
         VALUES ($1, $2, $3, $4) RETURNING id, first_name, email`,
        [body.first_name, body.email, hashedPassword, body.service_type]
      );
    } catch (err: any) {
      if (err?.code === "23505") {
        this.setStatus(409);
        throw Object.assign(new Error("Email already exists"), {
          error: { code: "DUPLICATE", message: "An account with this email already exists" },
        });
      }
      throw err;
    }

    const user = rows[0] as any;
    const token = sign(
      { id: user.id, email: user.email, role: "customer" },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = sign({ id: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    this.setStatus(201);
    return { id: user.id, first_name: user.first_name, email: user.email, token, refresh_token: refreshToken };
  }

  /**
   * Log in with email and password. Returns a JWT access token and refresh token.
   */
  @Post("login")
  @Response<ErrorResponse>(401, "Invalid credentials")
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const rows = await db.query(
      "SELECT id, first_name, email, password_hash, role FROM users WHERE email = $1",
      [body.email]
    );

    if (rows.length === 0) {
      this.setStatus(401);
      throw Object.assign(new Error("Invalid credentials"), {
        error: { code: "AUTH_FAILED", message: "Invalid credentials" },
      });
    }

    const user = rows[0] as any;
    const isMatch = await bcrypt.compare(body.password, user.password_hash.toString());

    if (!isMatch) {
      this.setStatus(401);
      throw Object.assign(new Error("Invalid credentials"), {
        error: { code: "AUTH_FAILED", message: "Invalid credentials" },
      });
    }

    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = sign({ id: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return { id: user.id, first_name: user.first_name, token, refresh_token: refreshToken };
  }

  /**
   * Initiate a password reset. Always returns a generic success response to prevent user enumeration.
   */
  @Post("forgot-password")
  public async forgotPassword(
    @Body() body: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    // TODO Phase 2: send reset email via email service (SendGrid / Resend)
    void body;
    return { message: "If an account exists with this email, a reset link has been sent." };
  }

  /**
   * Exchange a refresh token for a new access token.
   * @deprecated Phase 2 — not yet implemented
   */
  @Post("refresh")
  @Response<ErrorResponse>(501, "Not implemented")
  public async refresh(): Promise<ErrorResponse> {
    this.setStatus(501);
    return { error: { code: "NOT_IMPLEMENTED", message: "Token refresh not yet implemented" } };
  }
}
