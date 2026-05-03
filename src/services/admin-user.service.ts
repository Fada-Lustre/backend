import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as userRepo from "../repositories/user.repository";
import * as roleRepo from "../repositories/role.repository";
import * as inviteRepo from "../repositories/admin-invitation.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { blockUserByRole } from "./user-actions.service";
import { sendEmail, adminInvitationHtml } from "../lib/email";
import type { AdminProfileResponse } from "../types/admin-profile";

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

  const activateUrl = `https://admin.fadalustre.com/activate?email=${encodeURIComponent(email)}`;
  const html = adminInvitationHtml(firstName, email, tempPassword, activateUrl);
  await sendEmail(email, "You've been invited to Fada Lustre Admin", html).catch((err) => {
    console.error("Failed to send invitation email:", err);
  });

  return { id: inv.id, message: "Invitation email sent" };
}

export async function blockAdminUser(
  actorId: string,
  targetId: string
): Promise<{ id: string; status: string }> {
  return blockUserByRole(actorId, targetId, "admin", { selfBlockGuard: true });
}

export async function getAdminProfile(userId: string): Promise<AdminProfileResponse> {
  const user = await userRepo.findById(userId);
  if (!user || user.role !== "admin") {
    throw new ApplicationError(404, "Admin profile not found", "NOT_FOUND");
  }

  let role = { id: "", name: "", display_name: "", permissions: [] as string[] };
  if (user.admin_role_id) {
    const r = await roleRepo.findByIdWithAccess(user.admin_role_id);
    if (r) {
      role = { id: r.id, name: r.name, display_name: r.display_name, permissions: r.access ?? [] };
    }
  }

  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    profile_image_url: user.profile_image_url,
    role,
    status: user.status,
    created_at: user.created_at,
    last_login_at: user.last_login_at,
  };
}

export async function updateAdminProfile(
  userId: string,
  updates: { first_name?: string; last_name?: string; phone?: string }
): Promise<AdminProfileResponse> {
  const user = await userRepo.findById(userId);
  if (!user || user.role !== "admin") {
    throw new ApplicationError(404, "Admin profile not found", "NOT_FOUND");
  }

  const fields: Record<string, string> = {};
  if (updates.first_name !== undefined) fields.first_name = updates.first_name;
  if (updates.last_name !== undefined) fields.last_name = updates.last_name;
  if (updates.phone !== undefined) fields.phone = updates.phone;

  if (Object.keys(fields).length > 0) {
    await userRepo.updateById(userId, fields);
  }

  return getAdminProfile(userId);
}
