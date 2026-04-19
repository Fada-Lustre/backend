import * as addressRepo from "../repositories/address.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type { CreateAddressRequest, UpdateAddressRequest, AddressResponse } from "../types/address";

function validate(body: CreateAddressRequest) {
  if (!body.street || body.street.length > 500) {
    throw new ApplicationError(400, "Street is required (max 500 chars)", "VALIDATION_ERROR");
  }
  if (!["home", "office", "custom"].includes(body.label)) {
    throw new ApplicationError(400, "Label must be home, office, or custom", "VALIDATION_ERROR");
  }
  if (body.label === "custom" && (!body.custom_label || body.custom_label.length === 0)) {
    throw new ApplicationError(400, "custom_label is required when label is custom", "VALIDATION_ERROR");
  }
}

export async function list(userId: string): Promise<AddressResponse[]> {
  return addressRepo.listByUser(userId);
}

export async function getById(userId: string, addressId: string): Promise<AddressResponse> {
  const address = await addressRepo.findByIdForUser(addressId, userId);
  if (!address) {
    throw new ApplicationError(404, "Address not found", "NOT_FOUND");
  }
  return address;
}

export async function create(userId: string, body: CreateAddressRequest): Promise<AddressResponse> {
  validate(body);
  return addressRepo.create(userId, body);
}

export async function update(userId: string, addressId: string, body: UpdateAddressRequest): Promise<AddressResponse> {
  validate(body);
  const existing = await addressRepo.findByIdWithOwner(addressId);
  if (!existing) {
    throw new ApplicationError(404, "Address not found", "NOT_FOUND");
  }
  assertOwnership(existing.user_id, userId);

  const updated = await addressRepo.update(addressId, body);
  return updated!;
}

export async function remove(userId: string, addressId: string): Promise<void> {
  const existing = await addressRepo.findByIdWithOwner(addressId);
  if (!existing) {
    throw new ApplicationError(404, "Address not found", "NOT_FOUND");
  }
  assertOwnership(existing.user_id, userId);

  await addressRepo.softDelete(addressId);
}
