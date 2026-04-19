import { Controller, Get, Post, Path, Query, Route, Tags, Security, Request, Body, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as supportService from "../services/support.service";
import type { CreateTicketRequest, TicketListItem, TicketDetail } from "../types/support";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/support/tickets")
@Tags("Support")
@Security("jwt", ["customer", "cleaner"])
export class SupportController extends Controller {
  @Post("/")
  @SuccessResponse(201, "Created")
  public async createTicket(
    @Request() req: ExpressRequest,
    @Body() body: CreateTicketRequest
  ): Promise<{ id: string; status: string; created_at: string }> {
    this.setStatus(201);
    return supportService.createTicket(req.user!.id, body);
  }

  @Get("/")
  public async listTickets(
    @Request() req: ExpressRequest,
    @Query() status?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<TicketListItem>> {
    return supportService.listTickets(req.user!.id, status ?? "all", page ?? 1, limit ?? 20);
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Ticket not found")
  public async getTicket(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<TicketDetail> {
    return supportService.getTicket(req.user!.id, id);
  }
}
