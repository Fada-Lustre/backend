import { Body, Controller, Get, Patch, Route, Tags, Security, Request, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminUserService from "../services/admin-user.service";
import type { AdminProfileResponse, UpdateAdminProfileRequest } from "../types/admin-profile";
import type { ErrorResponse } from "../types/common";

@Route("v1/admin/profile")
@Tags("Admin Profile")
@Security("jwt", ["admin:home"])
export class AdminProfileController extends Controller {
  /**
   * Retrieve the authenticated admin's profile including name, email,
   * phone, role details, and assigned permissions.
   * @summary Get admin profile
   */
  @Get("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async getAdminProfile(
    @Request() req: ExpressRequest
  ): Promise<AdminProfileResponse> {
    return adminUserService.getAdminProfile(req.user!.id);
  }

  /**
   * Update the admin's profile fields (name, phone).
   * Only provided fields are updated.
   * @summary Update admin profile
   */
  @Patch("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async updateAdminProfile(
    @Request() req: ExpressRequest,
    @Body() body: UpdateAdminProfileRequest
  ): Promise<AdminProfileResponse> {
    return adminUserService.updateAdminProfile(req.user!.id, body);
  }
}
