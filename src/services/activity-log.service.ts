import * as activityLogRepo from "../repositories/activity-log.repository";

export async function logActivity(
  actorId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await activityLogRepo.insert(actorId, action, entityType, entityId, metadata);
}
