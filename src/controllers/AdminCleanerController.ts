import { Controller, Get, Post, Route, Tags, Security, Request, Query, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminCleanerService from "../services/admin-cleaner.service";
import { clampPagination } from "../lib/validation";
import type { AdminCleanerDetail, PayCleanerRequest, PayCleanerResponse } from "../types/admin-cleaner";
import type { ErrorResponse, IdStatusResponse } from "../types/common";
import type { AdminListResponse } from "../types/admin-common";

@Route("v1/admin/cleaners")
@Tags("Admin Cleaners")
@Security("jwt", ["admin:cleaners"])
export class AdminCleanerController extends Controller {
  @Get()
  public async listCleaners(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() status?: string,
    @Query() location?: string,
    @Query() service?: string,
    @Query() search?: string
  ): Promise<AdminListResponse<Record<string, unknown>>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminCleanerService.listCleaners(p, l, { status, location, service, search });
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getCleaner(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminCleanerDetail> {
    return adminCleanerService.getCleaner(id) as unknown as Promise<AdminCleanerDetail>;
  }

  @Post("{id}/block")
  @Response<ErrorResponse>(404, "Not found")
  public async blockCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminCleanerService.blockCleaner(req.user!.id, id);
  }

  @Post("{id}/pay")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(404, "Not found")
  public async payCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: PayCleanerRequest
  ): Promise<PayCleanerResponse> {
    this.setStatus(201);
    return adminCleanerService.payCleaner(req.user!.id, id, body.amount, body.account_number, body.bank_name);
  }
}
