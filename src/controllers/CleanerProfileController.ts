import { Body, Controller, Get, Patch, Route, Tags, Security, Request, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as cleanerProfileService from "../services/cleaner-profile.service";
import type {
  CleanerProfileResponse, UpdateCleanerProfileRequest,
  UpdateCleanerPhoneRequest, UpdateCleanerPhoneResponse,
  UpdateCleanerAddressRequest, UpdateCleanerAddressResponse,
} from "../types/cleaner-profile";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/profile")
@Tags("Cleaner Profile")
@Security("jwt", ["cleaner"])
export class CleanerProfileController extends Controller {
  @Get("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async getCleanerProfile(
    @Request() req: ExpressRequest
  ): Promise<CleanerProfileResponse> {
    return cleanerProfileService.getProfile(req.user!.id);
  }

  @Patch("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async updateCleanerProfile(
    @Request() req: ExpressRequest,
    @Body() body: UpdateCleanerProfileRequest
  ): Promise<CleanerProfileResponse> {
    return cleanerProfileService.updateProfile(req.user!.id, body);
  }

  @Patch("phone")
  @Response<ErrorResponse>(400, "Validation error")
  public async requestCleanerPhoneUpdate(
    @Request() req: ExpressRequest,
    @Body() body: UpdateCleanerPhoneRequest
  ): Promise<UpdateCleanerPhoneResponse> {
    return cleanerProfileService.requestPhoneUpdate(req.user!.id, body.phone, body.verification_method);
  }

  @Patch("address")
  @Response<ErrorResponse>(400, "Validation error")
  public async updateAddress(
    @Request() req: ExpressRequest,
    @Body() body: UpdateCleanerAddressRequest
  ): Promise<UpdateCleanerAddressResponse> {
    return cleanerProfileService.updateAddress(req.user!.id, body);
  }
}
