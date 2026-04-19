import * as notificationRepo from "../repositories/notification.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type { NotificationResponse } from "../types/notification";
import type { ListResponse } from "../types/common";

export async function list(
  userId: string, page = 1, limit = 20
): Promise<ListResponse<NotificationResponse>> {
  const result = await notificationRepo.listByUser(userId, page, limit);
  return {
    data: result.data as unknown as NotificationResponse[],
    meta: { total: result.total, page, limit: Math.min(limit, 50) },
  };
}

export async function markRead(userId: string, notificationId: string): Promise<void> {
  const row = await notificationRepo.findOwnerById(notificationId);

  if (!row) {
    throw new ApplicationError(404, "Notification not found", "NOT_FOUND");
  }

  assertOwnership(row.user_id, userId);

  await notificationRepo.markRead(notificationId);
}
