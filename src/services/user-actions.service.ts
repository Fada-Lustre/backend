import * as userRepo from "../repositories/user.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  cleaner: "Cleaner",
  admin: "admin user",
};

export async function blockUserByRole(
  actorId: string,
  targetId: string,
  role: string,
  opts: { selfBlockGuard?: boolean } = {}
): Promise<{ id: string; status: string }> {
  if (opts.selfBlockGuard && actorId === targetId) {
    throw new ApplicationError(400, "Cannot block yourself", "VALIDATION_ERROR");
  }

  const user = await userRepo.blockByIdAndRole(targetId, role);
  const label = ROLE_LABELS[role] ?? role;

  if (!user) {
    throw new ApplicationError(404, `${label} not found`, "NOT_FOUND");
  }

  await logActivity(
    actorId,
    `Blocked ${label} - ${user.first_name} ${user.last_name ?? ""}`.trim(),
    "user",
    targetId
  );

  return { id: user.id, status: user.status };
}
