import * as userRepo from "../repositories/user.repository";
import { ApplicationError } from "../errors";
import * as otpService from "./otp.service";
import { signUrl } from "../lib/r2";
import type {
  CleanerProfileResponse, UpdateCleanerProfileRequest,
  UpdateCleanerPhoneResponse, UpdateCleanerAddressRequest, UpdateCleanerAddressResponse,
} from "../types/cleaner-profile";

export async function getProfile(userId: string): Promise<CleanerProfileResponse> {
  const r = await userRepo.findCleanerProfileById(userId);
  if (!r) throw new ApplicationError(404, "Profile not found", "NOT_FOUND");

  const hasAddress = r.home_street || r.home_country || r.home_postcode;

  return {
    id: r.id, first_name: r.first_name, last_name: r.last_name,
    phone: r.phone, email: r.email, profile_image_url: await signUrl(r.profile_image_url),
    rating: r.rating ? parseFloat(r.rating) : null,
    completed_bookings: r.completed_bookings,
    location: r.home_street && r.home_postcode ? `${r.home_street}, ${r.home_postcode}` : null,
    address: hasAddress ? {
      street: r.home_street, country: r.home_country, postcode: r.home_postcode,
      floor_number: r.home_floor_number, door_number: r.home_door_number, entrance_notes: r.home_entrance_notes,
    } : null,
  };
}

export async function updateProfile(
  userId: string, body: UpdateCleanerProfileRequest
): Promise<CleanerProfileResponse> {
  if (body.first_name === undefined && body.last_name === undefined) return getProfile(userId);

  await userRepo.updateById(userId, {
    first_name: body.first_name,
    last_name: body.last_name,
  });

  return getProfile(userId);
}

export async function requestPhoneUpdate(
  userId: string, phone: string, method: "sms" | "email"
): Promise<UpdateCleanerPhoneResponse> {
  await otpService.createOtp(phone, "phone_update", userId);
  return { message: "Verification code sent", verification_method: method };
}

export async function updateAddress(
  userId: string, body: UpdateCleanerAddressRequest
): Promise<UpdateCleanerAddressResponse> {
  if (!body.address || !body.country || !body.postcode) {
    throw new ApplicationError(400, "address, country, and postcode are required", "VALIDATION_ERROR");
  }

  await userRepo.updateById(userId, {
    home_street: body.address,
    home_country: body.country,
    home_postcode: body.postcode,
    home_floor_number: body.floor_number ?? null,
    home_door_number: body.door_number ?? null,
    home_entrance_notes: body.entrance_notes ?? null,
  });

  return {
    street: body.address, country: body.country, postcode: body.postcode,
    floor_number: body.floor_number ?? null, door_number: body.door_number ?? null,
    entrance_notes: body.entrance_notes ?? null,
  };
}
