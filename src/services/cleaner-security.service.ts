import * as userRepo from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { ApplicationError } from "../errors";
import type { ChangePinResponse } from "../types/cleaner-security";

export async function changePin(
  userId: string, oldPin: string, newPin: string, confirmPin: string
): Promise<ChangePinResponse> {
  if (newPin !== confirmPin) {
    throw new ApplicationError(400, "New PIN and confirmation do not match", "VALIDATION_ERROR");
  }

  if (!/^\d{4}$/.test(newPin)) {
    throw new ApplicationError(400, "PIN must be exactly 4 digits", "VALIDATION_ERROR");
  }

  const user = await userRepo.findById(userId);
  if (!user) throw new ApplicationError(404, "User not found", "NOT_FOUND");

  if (user.transaction_pin_hash) {
    const match = await bcrypt.compare(oldPin, user.transaction_pin_hash);
    if (!match) throw new ApplicationError(400, "Current PIN is incorrect", "INVALID_PIN");
  }

  const hash = await bcrypt.hash(newPin, 10);
  await userRepo.updateById(userId, { transaction_pin_hash: hash });

  return { message: "PIN changed successfully" };
}
