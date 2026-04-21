import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Query, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminSupportService from "../services/admin-support.service";
import { clampPagination } from "../lib/validation";
import type { AdminTicketMessageRequest, AdminTicketUpdateRequest, AdminTicketDetail } from "../types/admin-support";
import type { ErrorResponse } from "../types/common";
import type { AdminListResponse } from "../types/admin-common";

@Route("v1/admin/support/tickets")
@Tags("Admin Support")
@Security("jwt", ["admin:support"])
export class AdminSupportController extends Controller {
  @Get()
  public async listTickets(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() status?: string,
    @Query() search?: string
  ): Promise<AdminListResponse<Record<string, unknown>>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminSupportService.listTickets(p, l, { status, search });
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getTicket(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminTicketDetail> {
    return adminSupportService.getTicket(id) as unknown as Promise<AdminTicketDetail>;
  }

  @Post("{id}/messages")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(404, "Not found")
  public async addMessage(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminTicketMessageRequest
  ): Promise<{ id: string; body: string; created_at: string }> {
    this.setStatus(201);
    return adminSupportService.addMessage(req.user!.id, id, body.body);
  }

  @Patch("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async updateTicket(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminTicketUpdateRequest
  ): Promise<Record<string, unknown>> {
    return adminSupportService.updateTicket(req.user!.id, id, body);
  }
}
