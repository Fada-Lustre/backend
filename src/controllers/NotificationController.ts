import { Controller, Get, Patch, Path, Query, Route, Tags, Security, Request, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as notificationService from "../services/notification.service";
import type { NotificationResponse } from "../types/notification";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/notifications")
@Tags("Notifications")
@Security("jwt", ["customer"])
export class NotificationController extends Controller {
  /**
   * List notifications for the authenticated user with pagination.
   * Returns both read and unread notifications.
   * @summary List notifications
   */
  @Get("/")
  public async listNotifications(
    @Request() req: ExpressRequest,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<NotificationResponse>> {
    return notificationService.list(req.user!.id, page ?? 1, limit ?? 20);
  }

  /**
   * Mark a specific notification as read. Returns 204 on success.
   * @summary Mark notification read
   */
  @Patch("{id}/read")
  @SuccessResponse(204, "Marked as read")
  @Response<ErrorResponse>(404, "Notification not found")
  public async markRead(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await notificationService.markRead(req.user!.id, id);
    this.setStatus(204);
  }
}
