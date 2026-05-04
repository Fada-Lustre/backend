import { Body, Controller, Post, Route, Tags, Response, SuccessResponse, Security, Request } from "tsoa";
import bcrypt from "bcryptjs";
import { Request as ExpressRequest } from "express";
import { ApplicationError } from "../errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { blacklistToken } from "../lib/token-blacklist";
import { validatePassword } from "../lib/validation";
import * as otpService from "../services/otp.service";
import * as userRepo from "../repositories/user.repository";
import type {
  RegisterRequest, AuthResponse,
  LoginRequest, LoginResponse,
  ForgotPasswordRequest, ForgotPasswordResponse,
  VerifyOtpRequest, VerifyOtpResponse,
  ResetPasswordRequest, ResetPasswordResponse,
  ChangePasswordRequest, ChangePasswordResponse,
  RefreshRequest, RefreshResponse,
  AdminForgotPasswordRequest, AdminForgotPasswordResponse,
  AdminResetPasswordRequest, AdminResetPasswordResponse,
  AdminVerifyOtpRequest, AdminVerifyOtpResponse,
} from "../types/auth";
import { sendEmail, passwordResetHtml } from "../lib/email";
import type { ActivateRequest, ActivateResponse, SetupProfileRequest, SetupProfileResponse } from "../types/admin-auth";
import type { ErrorResponse } from "../types/common";
import * as adminAuthService from "../services/admin-auth.service";

@Route("v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  /**
   * Register a new customer account with email and password.
   * Returns JWT access and refresh tokens on success.
   * @summary Register new customer
   */
  @Post("register")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Email already registered")
  public async register(@Body() body: RegisterRequest): Promise<AuthResponse> {
    validatePassword(body.password);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    let user: import("../repositories/user.repository").UserRow;
    try {
      user = await userRepo.create({
        first_name: body.first_name,
        email: body.email,
        password_hash: hashedPassword,
        service_type: body.service_type,
      });
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr.code === "23505") {
        throw new ApplicationError(409, "An account with this email already exists", "DUPLICATE");
      }
      throw err;
    }

    const token = signAccessToken({ id: user.id, email: user.email, role: "customer" });
    const refreshToken = signRefreshToken(user.id);

    this.setStatus(201);
    return { id: user.id, first_name: user.first_name, email: user.email, token, refresh_token: refreshToken };
  }

  /**
   * Authenticate a user (customer, cleaner, or admin) with email and password.
   * Returns JWT tokens. Blocked accounts receive a 403 error.
   * @summary Login
   */
  @Post("login")
  @Response<ErrorResponse>(401, "Invalid credentials")
  public async login(@Body() body: LoginRequest): Promise<LoginResponse> {
    const user = await userRepo.findByEmail(body.email);

    if (!user) {
      throw new ApplicationError(401, "Invalid credentials", "AUTH_FAILED");
    }

    const isMatch = await bcrypt.compare(body.password, user.password_hash);

    if (!isMatch) {
      throw new ApplicationError(401, "Invalid credentials", "AUTH_FAILED");
    }

    if (user.status === "blocked") {
      throw new ApplicationError(403, "Account is blocked", "ACCOUNT_BLOCKED");
    }

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);

    return { id: user.id, first_name: user.first_name, token, refresh_token: refreshToken };
  }

  /**
   * Request a password reset by phone number. Sends an OTP code via SMS
   * if a matching account exists. Returns a generic message to prevent email enumeration.
   * @summary Request password reset OTP
   */
  @Post("forgot-password")
  public async forgotPassword(
    @Body() body: ForgotPasswordRequest
  ): Promise<ForgotPasswordResponse> {
    const user = await userRepo.findByPhone(body.phone);

    if (user) {
      await otpService.createOtp(body.phone, "password_reset", user.id);
    }

    return { message: "If an account exists with this phone number, a verification code has been sent." };
  }

  /**
   * Verify a one-time password (OTP) code sent during the password reset flow.
   * Must be called before reset-password.
   * @summary Verify OTP code
   */
  @Post("verify-otp")
  @Response<ErrorResponse>(400, "Invalid or expired code")
  public async verifyOtp(@Body() body: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    await otpService.verifyOtp(body.phone, body.code, "password_reset");
    return { verified: true };
  }

  /**
   * Set a new password after successful OTP verification.
   * Requires matching new_password and confirm_password fields.
   * @summary Reset password
   */
  @Post("reset-password")
  @Response<ErrorResponse>(400, "Validation error")
  public async resetPassword(@Body() body: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    if (body.new_password !== body.confirm_password) {
      throw new ApplicationError(400, "Passwords do not match", "VALIDATION_ERROR");
    }

    validatePassword(body.new_password);

    const verified = await otpService.hasVerifiedOtp(body.phone, "password_reset");
    if (!verified) {
      throw new ApplicationError(400, "Phone number not verified. Complete OTP verification first.", "OTP_NOT_VERIFIED");
    }

    const hash = await bcrypt.hash(body.new_password, 10);
    const result = await userRepo.updatePasswordHashByPhone(body.phone, hash);

    if (!result) {
      throw new ApplicationError(404, "Account not found", "NOT_FOUND");
    }

    return { message: "Password reset successful" };
  }

  /**
   * Change the password for the currently authenticated user.
   * Requires the current password for verification.
   * @summary Change password
   */
  @Post("change-password")
  @Security("jwt")
  @Response<ErrorResponse>(400, "Validation error")
  public async changePassword(
    @Request() req: ExpressRequest,
    @Body() body: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> {
    if (body.new_password !== body.confirm_password) {
      throw new ApplicationError(400, "Passwords do not match", "VALIDATION_ERROR");
    }

    validatePassword(body.new_password);

    const userId = req.user!.id;
    const user = await userRepo.findById(userId);

    if (!user) {
      throw new ApplicationError(404, "Account not found", "NOT_FOUND");
    }

    const isMatch = await bcrypt.compare(body.current_password, user.password_hash);
    if (!isMatch) {
      throw new ApplicationError(400, "Current password is incorrect", "INVALID_PASSWORD");
    }

    const hash = await bcrypt.hash(body.new_password, 10);
    await userRepo.updatePasswordHashById(userId, hash);

    return { message: "Password changed" };
  }

  /**
   * Exchange a valid refresh token for a new access/refresh token pair.
   * Use this to maintain sessions without re-authenticating.
   * @summary Refresh tokens
   */
  @Post("refresh")
  @Response<ErrorResponse>(401, "Invalid refresh token")
  public async refresh(@Body() body: RefreshRequest): Promise<RefreshResponse> {
    let decoded: { id: string };
    try {
      decoded = verifyRefreshToken<{ id: string }>(body.refresh_token);
    } catch {
      throw new ApplicationError(401, "Invalid or expired refresh token", "AUTH_INVALID");
    }

    const user = await userRepo.findById(decoded.id);

    if (!user) {
      throw new ApplicationError(401, "User not found", "AUTH_INVALID");
    }

    if (user.status === "blocked") {
      throw new ApplicationError(403, "Account is blocked", "ACCOUNT_BLOCKED");
    }

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);

    return { token, refresh_token: refreshToken };
  }

  /**
   * Request a password reset for an admin account via email.
   * Sends a 6-digit reset code to the admin's email address.
   * @summary Admin forgot password
   */
  @Post("admin/forgot-password")
  public async adminForgotPassword(
    @Body() body: AdminForgotPasswordRequest
  ): Promise<AdminForgotPasswordResponse> {
    const user = await userRepo.findByEmailAndRole(body.email, "admin");

    if (user) {
      const code = await otpService.createOtp(body.email, "password_reset", user.id);
      const html = passwordResetHtml(user.first_name, code);
      await sendEmail(body.email, "Password Reset - Fada Lustre Admin", html).catch((err) => {
        console.error("Failed to send reset email:", err);
      });
    }

    return { message: "If an admin account exists with this email, a reset code has been sent." };
  }

  /**
   * Verify an OTP code sent during the admin password reset flow.
   * Use this to validate the code before showing the new-password form.
   * @summary Verify admin OTP
   */
  @Post("admin/verify-otp")
  @Response<ErrorResponse>(400, "Invalid or expired code")
  public async verifyAdminOtp(
    @Body() body: AdminVerifyOtpRequest
  ): Promise<AdminVerifyOtpResponse> {
    await otpService.verifyOtp(body.email, body.code, "password_reset");
    return { verified: true };
  }

  /**
   * Reset an admin's password using the code sent via email.
   * @summary Admin reset password
   */
  @Post("admin/reset-password")
  @Response<ErrorResponse>(400, "Validation error")
  public async adminResetPassword(
    @Body() body: AdminResetPasswordRequest
  ): Promise<AdminResetPasswordResponse> {
    if (body.new_password !== body.confirm_password) {
      throw new ApplicationError(400, "Passwords do not match", "VALIDATION_ERROR");
    }

    validatePassword(body.new_password);

    await otpService.verifyOtp(body.email, body.code, "password_reset");

    const user = await userRepo.findByEmailAndRole(body.email, "admin");
    if (!user) {
      throw new ApplicationError(404, "Admin account not found", "NOT_FOUND");
    }

    const hash = await bcrypt.hash(body.new_password, 10);
    await userRepo.updatePasswordHashById(user.id, hash);

    return { message: "Password reset successful" };
  }

  /**
   * Activate an invited admin account using the email and temporary password
   * received in the invitation. Returns an activation token for profile setup.
   * @summary Activate admin invitation
   */
  @Post("activate")
  @Response<ErrorResponse>(400, "Invalid invitation")
  @Response<ErrorResponse>(401, "Invalid credentials")
  public async activate(@Body() body: ActivateRequest): Promise<ActivateResponse> {
    return adminAuthService.activate(body.email, body.temporary_password);
  }

  /**
   * Complete admin onboarding by setting up the profile with name, phone,
   * and a permanent password. Requires the activation token from /activate.
   * @summary Setup admin profile
   */
  @Post("setup-profile")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  @Response<ErrorResponse>(401, "Invalid token")
  public async setupProfile(
    @Request() req: ExpressRequest,
    @Body() body: SetupProfileRequest
  ): Promise<SetupProfileResponse> {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw new ApplicationError(401, "Activation token required", "AUTH_REQUIRED");
    }
    const activationToken = header.slice(7);
    this.setStatus(201);
    return adminAuthService.setupProfile(
      activationToken,
      body.first_name,
      body.last_name,
      body.phone,
      body.password,
      body.confirm_password
    );
  }

  /**
   * Invalidate the current access token, effectively logging the user out.
   * The token is added to an in-memory blacklist until it expires naturally.
   * @summary Logout
   */
  @Post("logout")
  @Security("jwt")
  @SuccessResponse(204, "Logged out")
  public async logout(@Request() req: ExpressRequest): Promise<void> {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const token = header.slice(7);
      const exp = req.user?.exp ?? Math.floor(Date.now() / 1000) + 3600;
      blacklistToken(token, exp);
    }
    this.setStatus(204);
  }
}
