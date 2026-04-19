import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as userRepo from "../repositories/user.repository";
import * as roleRepo from "../repositories/role.repository";
import * as inviteRepo from "../repositories/admin-invitation.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { blockUserByRole } from "./user-actions.service";

export async function listAdminUsers(
  page: number,
  limit: number,
  status?: string,
  search?: string
): Promise<{ data: Record<string, unknown>[]; meta: { total: number; page: number; limit: number } }> {
  const result = await userRepo.listAdminsAdmin({ status, search }, page, limit);
  return { data: result.data as unknown as Record<string, unknown>[], meta: { total: result.total, page, limit } };
}

export async function inviteAdmin(
  actorId: string,
  firstName: string,
  lastName: string,
  email: string,
  roleId: string
): Promise<{ id: string; message: string }> {
  const roleExists = await roleRepo.existsById(roleId);
  if (!roleExists) {
    throw new ApplicationError(400, "Invalid role_id", "VALIDATION_ERROR");
  }

  const existingInvite = await inviteRepo.findPendingByEmail(email);
  if (existingInvite) {
    throw new ApplicationError(409, "A pending invitation already exists for this email", "DUPLICATE");
  }

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new ApplicationError(409, "A user with this email already exists", "DUPLICATE");
  }

  const tempPassword = crypto.randomBytes(6).toString("hex");
  const tempHash = await bcrypt.hash(tempPassword, 10);

  const inv = await inviteRepo.create({ email, role_id: roleId, temp_password_hash: tempHash, invited_by: actorId });

  await logActivity(actorId, `Invited new admin user - ${firstName} ${lastName}`, "admin_invitation", inv.id);

  return { id: inv.id, message: "Invitation email sent" };
}

export async function blockAdminUser(
  actorId: string,
  targetId: string
): Promise<{ id: string; status: string }> {
  return blockUserByRole(actorId, targetId, "admin", { selfBlockGuard: true });
}
