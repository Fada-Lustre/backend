import { Controller, Get, Route, Tags, Security, Request, Query } from "tsoa";
import { Request as ExpressRequest } from "express";
import { clampPagination } from "../lib/validation";
import * as activityLogService from "../services/admin-activity-log.service";
import type { ActivityLogResponse } from "../types/admin-activity-log";

@Route("v1/admin/activity-log")
@Tags("Admin Activity Log")
@Security("jwt", ["admin:control_permissions"])
export class AdminActivityLogController extends Controller {
  /**
   * Retrieve the admin activity log showing all actions performed by admin users.
   * Supports text search and pagination.
   * @summary Get activity log
   */
  @Get()
  public async getActivityLog(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 20,
    @Query() search?: string
  ): Promise<ActivityLogResponse> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return activityLogService.getActivityLog(p, l, search);
  }
}
