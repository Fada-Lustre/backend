import * as activityLogRepo from "../repositories/activity-log.repository";
import type { ActivityLogResponse } from "../types/admin-activity-log";

export async function getActivityLog(
  page: number,
  limit: number,
  search?: string
): Promise<ActivityLogResponse> {
  const result = await activityLogRepo.listWithFilters(page, limit, search);
  return { data: result.data, meta: { total: result.total, page, limit } };
}
