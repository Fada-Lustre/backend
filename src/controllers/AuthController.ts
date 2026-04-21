import { Body, Controller, Post, Route, Tags, Response, SuccessResponse, Security, Request } from "tsoa";
import bcrypt from "bcryptjs";
import { Request as ExpressRequest } from "express";
import { ApplicationError } from "../errors";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
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
} from "../types/auth";
import type { ActivateRequest, ActivateResponse, SetupProfileRequest, SetupProfileResponse } from "../types/admin-auth";
import type { ErrorResponse } from "../types/common";
import * as adminAuthService from "../services/admin-auth.service";

@Route("v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
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

  @Post("verify-otp")
  @Response<ErrorResponse>(400, "Invalid or expired code")
  public async verifyOtp(@Body() body: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    await otpService.verifyOtp(body.phone, body.code, "password_reset");
    return { verified: true };
  }

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

  @Post("activate")
  @Response<ErrorResponse>(400, "Invalid invitation")
  @Response<ErrorResponse>(401, "Invalid credentials")
  public async activate(@Body() body: ActivateRequest): Promise<ActivateResponse> {
    return adminAuthService.activate(body.email, body.temporary_password);
  }

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
}
