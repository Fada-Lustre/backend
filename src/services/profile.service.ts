import * as userRepo from "../repositories/user.repository";
import { ApplicationError } from "../errors";
import * as otpService from "./otp.service";
import type { ProfileResponse, UpdateProfileRequest, UpdatePhoneResponse } from "../types/profile";

function toProfileResponse(user: userRepo.UserRow): ProfileResponse {
  return {
    id: user.id, first_name: user.first_name, last_name: user.last_name,
    phone: user.phone, email: user.email, profile_image_url: user.profile_image_url,
    rating: user.rating_avg,
  } as unknown as ProfileResponse;
}

export async function getProfile(userId: string): Promise<ProfileResponse> {
  const user = await userRepo.findById(userId);
  if (!user) throw new ApplicationError(404, "Profile not found", "NOT_FOUND");
  return toProfileResponse(user);
}

export async function updateProfile(
  userId: string,
  body: UpdateProfileRequest
): Promise<ProfileResponse> {
  if (body.first_name === undefined && body.last_name === undefined) {
    return getProfile(userId);
  }

  const updated = await userRepo.updateById(userId, {
    first_name: body.first_name,
    last_name: body.last_name,
  });

  if (!updated) throw new ApplicationError(404, "Profile not found", "NOT_FOUND");
  return toProfileResponse(updated);
}

export async function requestPhoneUpdate(
  userId: string,
  phone: string,
  method: "sms" | "email"
): Promise<UpdatePhoneResponse> {
  await otpService.createOtp(phone, "phone_update", userId);
  return {
    message: "Verification code sent",
    verification_method: method,
  };
}
