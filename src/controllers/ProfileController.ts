import { Body, Controller, Get, Patch, Route, Tags, Security, Request, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as profileService from "../services/profile.service";
import type { ProfileResponse, UpdateProfileRequest, UpdatePhoneRequest, UpdatePhoneResponse } from "../types/profile";
import type { ErrorResponse } from "../types/common";

@Route("v1/customer/profile")
@Tags("Profile")
@Security("jwt", ["customer"])
export class ProfileController extends Controller {
  /**
   * Retrieve the authenticated customer's profile including name, email,
   * phone, and profile image.
   * @summary Get my profile
   */
  @Get("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async getCustomerProfile(
    @Request() req: ExpressRequest
  ): Promise<ProfileResponse> {
    return profileService.getProfile(req.user!.id);
  }

  /**
   * Update the customer's profile fields (name, email, etc.).
   * Only provided fields are updated.
   * @summary Update my profile
   */
  @Patch("/")
  @Response<ErrorResponse>(404, "Profile not found")
  public async updateCustomerProfile(
    @Request() req: ExpressRequest,
    @Body() body: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    return profileService.updateProfile(req.user!.id, body);
  }

  /**
   * Initiate a phone number change by sending an OTP via SMS or email.
   * The phone number is updated after OTP verification.
   * @summary Request phone update
   */
  @Patch("phone")
  @Response<ErrorResponse>(400, "Validation error")
  public async requestCustomerPhoneUpdate(
    @Request() req: ExpressRequest,
    @Body() body: UpdatePhoneRequest
  ): Promise<UpdatePhoneResponse> {
    return profileService.requestPhoneUpdate(req.user!.id, body.phone, body.verification_method);
  }
}
