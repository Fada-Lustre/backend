import * as roleRepo from "../repositories/role.repository";
import * as userRepo from "../repositories/user.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";

export async function listRoles(): Promise<Record<string, unknown>[]> {
  return roleRepo.listWithPermissions() as unknown as Record<string, unknown>[];
}

export async function createRole(
  actorId: string,
  name: string,
  displayName: string,
  access: string[]
): Promise<{ id: string; name: string; access: string[] }> {
  if (!name || name.length > 100) {
    throw new ApplicationError(400, "Role name must be 1-100 characters", "VALIDATION_ERROR");
  }

  const VALID_PERMISSIONS = [
    "home", "bookings", "customers", "cleaners",
    "services", "cost_guides", "transactions",
    "support", "all_users", "control_permissions",
  ];
  const invalid = access.filter((a) => !VALID_PERMISSIONS.includes(a));
  if (invalid.length > 0) {
    throw new ApplicationError(400, `Invalid permissions: ${invalid.join(", ")}`, "VALIDATION_ERROR");
  }

  let roleId: string;
  try {
    const r = await roleRepo.create(name, displayName);
    roleId = r.id;
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "23505") {
      throw new ApplicationError(409, "A role with this name already exists", "DUPLICATE");
    }
    throw err;
  }

  await roleRepo.setPermissions(roleId, access);

  await logActivity(actorId, `Created role - ${displayName}`, "role", roleId);

  return { id: roleId, name, access };
}

export async function updateRole(
  actorId: string,
  roleId: string,
  updates: { name?: string; display_name?: string; access?: string[] }
): Promise<Record<string, unknown>> {
  const existing = await roleRepo.findById(roleId);
  if (!existing) {
    throw new ApplicationError(404, "Role not found", "NOT_FOUND");
  }

  const fields: Record<string, string> = {};
  if (updates.name !== undefined) fields.name = updates.name;
  if (updates.display_name !== undefined) fields.display_name = updates.display_name;

  if (Object.keys(fields).length > 0) {
    await roleRepo.updateById(roleId, fields);
  }

  if (updates.access !== undefined) {
    await roleRepo.setPermissions(roleId, updates.access);
  }

  const updated = await roleRepo.findByIdWithAccess(roleId);

  await logActivity(actorId, `Updated role - ${updated!.display_name}`, "role", roleId);

  return updated! as unknown as Record<string, unknown>;
}

export async function archiveRole(
  actorId: string,
  roleId: string
): Promise<{ id: string; status: string }> {
  const existing = await roleRepo.findById(roleId);
  if (!existing) {
    throw new ApplicationError(404, "Role not found", "NOT_FOUND");
  }

  if (existing.is_system) {
    throw new ApplicationError(400, "Cannot archive a system role", "VALIDATION_ERROR");
  }

  const userCount = await userRepo.countByAdminRole(roleId);
  if (userCount > 0) {
    throw new ApplicationError(400, "Reassign users from this role before archiving", "ROLE_HAS_USERS");
  }

  await roleRepo.archive(roleId);

  await logActivity(actorId, `Archived role - ${existing.display_name}`, "role", roleId);

  return { id: roleId, status: "archived" };
}
