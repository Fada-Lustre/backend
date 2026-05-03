import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as otpRepo from "../repositories/otp.repository";
import { ApplicationError } from "../errors";
import type { SmsProvider } from "./interfaces/sms.interface";
import { smsStub } from "./stubs/sms.stub";

type OtpPurpose = "registration" | "login" | "phone_update" | "password_reset";

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

let smsProvider: SmsProvider = smsStub;

export function setSmsProvider(provider: SmsProvider) {
  smsProvider = provider;
}

function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createOtp(
  phone: string,
  purpose: OtpPurpose,
  userId?: string
): Promise<string> {
  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 4);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await otpRepo.create(phone, purpose, codeHash, expiresAt, userId);

  await smsProvider.send(phone, `Your Fada Lustre verification code is: ${code}`);

  return code;
}

export async function verifyOtp(
  phone: string,
  code: string,
  purpose: OtpPurpose
): Promise<{ userId: string | null }> {
  const otp = await otpRepo.findValid(phone, purpose);
  if (!otp) {
    throw new ApplicationError(400, "Invalid or expired verification code", "OTP_INVALID");
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    throw new ApplicationError(400, "Too many verification attempts", "OTP_MAX_ATTEMPTS");
  }

  await otpRepo.incrementAttempts(otp.id);

  const isMatch = await bcrypt.compare(code, otp.code_hash);
  if (!isMatch) {
    throw new ApplicationError(400, "Invalid or expired verification code", "OTP_INVALID");
  }

  await otpRepo.markVerified(otp.id);

  return { userId: otp.user_id };
}

export async function hasVerifiedOtp(
  phone: string,
  purpose: OtpPurpose
): Promise<boolean> {
  return otpRepo.hasVerified(phone, purpose);
}
