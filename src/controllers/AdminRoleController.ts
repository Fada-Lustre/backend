import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminRoleService from "../services/admin-role.service";
import type { RoleListResponse, RoleListItem, CreateRoleRequest, CreateRoleResponse, UpdateRoleRequest, ArchiveRoleResponse } from "../types/admin-role";
import type { ErrorResponse } from "../types/common";

@Route("v1/admin/roles")
@Tags("Admin Roles")
@Security("jwt", ["admin:control_permissions"])
export class AdminRoleController extends Controller {
  @Get()
  public async listRoles(@Request() _req: ExpressRequest): Promise<RoleListResponse> {
    const data = await adminRoleService.listRoles();
    return { data } as unknown as RoleListResponse;
  }

  @Post()
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Duplicate")
  public async createRole(
    @Request() req: ExpressRequest,
    @Body() body: CreateRoleRequest
  ): Promise<CreateRoleResponse> {
    this.setStatus(201);
    return adminRoleService.createRole(req.user!.id, body.name, body.display_name, body.access);
  }

  @Patch("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async updateRole(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateRoleRequest
  ): Promise<RoleListItem> {
    return adminRoleService.updateRole(req.user!.id, id, body) as unknown as Promise<RoleListItem>;
  }

  @Patch("{id}/archive")
  @Response<ErrorResponse>(400, "Role has users")
  @Response<ErrorResponse>(404, "Not found")
  public async archiveRole(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<ArchiveRoleResponse> {
    return adminRoleService.archiveRole(req.user!.id, id);
  }
}
