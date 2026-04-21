import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminCostGuideService from "../services/admin-cost-guide.service";
import type { CreateCostGuideRequest, UpdateCostGuideRequest, AdminCostGuideDetail } from "../types/admin-cost-guide";
import type { ErrorResponse, IdStatusResponse } from "../types/common";

@Route("v1/admin/cost-guides")
@Tags("Admin Cost Guides")
@Security("jwt", ["admin:services"])
export class AdminCostGuideController extends Controller {
  @Get()
  public async listAdminCostGuides(@Request() _req: ExpressRequest): Promise<{ data: Record<string, unknown>[]; stats: { total: number; active: number; archived: number } }> {
    return adminCostGuideService.listCostGuides();
  }

  @Post()
  @SuccessResponse(201, "Created")
  public async createCostGuide(
    @Request() req: ExpressRequest,
    @Body() body: CreateCostGuideRequest
  ): Promise<{ id: string; title: string; status: string }> {
    this.setStatus(201);
    return adminCostGuideService.createCostGuide(req.user!.id, body.title, body.description, body.content_blocks);
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getAdminCostGuide(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminCostGuideDetail> {
    return adminCostGuideService.getCostGuide(id) as unknown as Promise<AdminCostGuideDetail>;
  }

  @Patch("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async updateCostGuide(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateCostGuideRequest
  ): Promise<AdminCostGuideDetail> {
    return adminCostGuideService.updateCostGuide(req.user!.id, id, body) as unknown as Promise<AdminCostGuideDetail>;
  }

  @Patch("{id}/archive")
  @Response<ErrorResponse>(404, "Not found")
  public async archiveCostGuide(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminCostGuideService.archiveCostGuide(req.user!.id, id);
  }
}
