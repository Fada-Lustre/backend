import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Path, Body, Query, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminCostGuideService from "../services/admin-cost-guide.service";
import type { CreateCostGuideRequest, UpdateCostGuideRequest, AdminCostGuideDetail } from "../types/admin-cost-guide";
import type { ErrorResponse, IdStatusResponse } from "../types/common";

@Route("v1/admin/cost-guides")
@Tags("Admin Cost Guides")
@Security("jwt", ["admin:services"])
export class AdminCostGuideController extends Controller {
  /**
   * List all cost guides with stats (total, active, archived).
   * @summary List cost guides
   * @param status Filter by status: active, archived
   * @param period Filter by creation date: today, this_month, past_3_months, past_6_months, past_year, all_time
   * @param search Search by title
   */
  @Get()
  public async listAdminCostGuides(
    @Request() _req: ExpressRequest,
    @Query() status?: "active" | "archived",
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time",
    @Query() search?: string
  ): Promise<{ data: Record<string, unknown>[]; stats: { total: number; active: number; archived: number } }> {
    return adminCostGuideService.listCostGuides({ status, period, search });
  }

  /**
   * Create a new cost guide with title, description, and structured content blocks.
   * @summary Create cost guide
   */
  @Post()
  @SuccessResponse(201, "Created")
  public async createCostGuide(
    @Request() req: ExpressRequest,
    @Body() body: CreateCostGuideRequest
  ): Promise<{ id: string; title: string; status: string }> {
    this.setStatus(201);
    return adminCostGuideService.createCostGuide(req.user!.id, body.title, body.description, body.content_blocks);
  }

  /**
   * Retrieve a cost guide with full content blocks for editing.
   * @summary Get cost guide details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getAdminCostGuide(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminCostGuideDetail> {
    return adminCostGuideService.getCostGuide(id) as unknown as Promise<AdminCostGuideDetail>;
  }

  /**
   * Update a cost guide's title, description, or content blocks.
   * @summary Update cost guide
   */
  @Patch("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async updateCostGuide(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateCostGuideRequest
  ): Promise<AdminCostGuideDetail> {
    return adminCostGuideService.updateCostGuide(req.user!.id, id, body) as unknown as Promise<AdminCostGuideDetail>;
  }

  /**
   * Archive a cost guide, hiding it from public listings.
   * @summary Archive cost guide
   */
  @Patch("{id}/archive")
  @Response<ErrorResponse>(404, "Not found")
  public async archiveCostGuide(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminCostGuideService.archiveCostGuide(req.user!.id, id);
  }

  /**
   * Unarchive a cost guide, restoring it to public listings.
   * @summary Unarchive cost guide
   */
  @Patch("{id}/unarchive")
  @Response<ErrorResponse>(404, "Not found")
  public async unarchiveCostGuide(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminCostGuideService.unarchiveCostGuide(req.user!.id, id);
  }
}
