import { Controller, Get, Patch, Path, Query, Route, Tags, Security, Request, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as notificationService from "../services/notification.service";
import type { NotificationResponse } from "../types/notification";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/notifications")
@Tags("Notifications")
@Security("jwt", ["customer"])
export class NotificationController extends Controller {
  @Get("/")
  public async listNotifications(
    @Request() req: ExpressRequest,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<NotificationResponse>> {
    return notificationService.list(req.user!.id, page ?? 1, limit ?? 20);
  }

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
