import { Controller, Get, Post, Route, Tags, Security, Request, Query, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminUserService from "../services/admin-user.service";
import { clampPagination } from "../lib/validation";
import type { AdminUserListResponse, InviteAdminRequest, InviteAdminResponse } from "../types/admin-user";
import type { ErrorResponse, IdStatusResponse } from "../types/common";

@Route("v1/admin/users")
@Tags("Admin Users")
@Security("jwt", ["admin:all_users"])
export class AdminUserController extends Controller {
  /**
   * List all admin users with filters for status and text search.
   * @summary List admin users
   */
  @Get()
  public async listAdminUsers(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() status?: string,
    @Query() search?: string
  ): Promise<AdminUserListResponse> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminUserService.listAdminUsers(p, l, status, search) as unknown as AdminUserListResponse;
  }

  /**
   * Invite a new admin user by email. Generates a temporary password
   * and creates a pending invitation record.
   * @summary Invite admin user
   */
  @Post()
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Duplicate")
  public async inviteAdmin(
    @Request() req: ExpressRequest,
    @Body() body: InviteAdminRequest
  ): Promise<InviteAdminResponse> {
    this.setStatus(201);
    return adminUserService.inviteAdmin(
      req.user!.id,
      body.first_name,
      body.last_name,
      body.email,
      body.role_id
    );
  }

  /**
   * Block an admin user, revoking their dashboard access.
   * Cannot block your own account.
   * @summary Block admin user
   */
  @Post("{id}/block")
  @Response<ErrorResponse>(404, "Not found")
  public async blockAdminUser(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminUserService.blockAdminUser(req.user!.id, id);
  }
}
