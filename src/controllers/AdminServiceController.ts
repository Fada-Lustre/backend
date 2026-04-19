import { Controller, Get, Patch, Route, Tags, Security, Request, Path, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminServiceService from "../services/admin-service.service";
import type { AdminServiceDetail } from "../types/admin-service";
import type { ErrorResponse, IdStatusResponse } from "../types/common";

@Route("v1/admin/services")
@Tags("Admin Services")
@Security("jwt", ["admin:services"])
export class AdminServiceController extends Controller {
  @Get()
  public async listServices(@Request() _req: ExpressRequest): Promise<{ data: Record<string, unknown>[]; stats: { total: number; active: number; archived: number } }> {
    return adminServiceService.listServices();
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getService(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminServiceDetail> {
    return adminServiceService.getService(id) as unknown as Promise<AdminServiceDetail>;
  }

  @Patch("{id}/archive")
  @Response<ErrorResponse>(404, "Not found")
  public async archiveService(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminServiceService.archiveService(req.user!.id, id);
  }
}
