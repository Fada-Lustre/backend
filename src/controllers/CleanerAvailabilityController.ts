import { Body, Controller, Get, Put, Route, Tags, Security, Request, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as availabilityService from "../services/cleaner-availability.service";
import type { AvailabilityResponse, UpdateAvailabilityRequest } from "../types/cleaner-availability";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/availability")
@Tags("Cleaner Availability")
@Security("jwt", ["cleaner"])
export class CleanerAvailabilityController extends Controller {
  /**
   * Retrieve the cleaner's current availability settings including
   * mode (default/custom), working hours, and day overrides.
   * @summary Get availability
   */
  @Get("/")
  public async getAvailability(
    @Request() req: ExpressRequest
  ): Promise<AvailabilityResponse> {
    return availabilityService.getAvailability(req.user!.id);
  }

  /**
   * Update the cleaner's availability settings. Can toggle accepting bookings,
   * set default hours, or define custom day-by-day schedules.
   * @summary Update availability
   */
  @Put("/")
  @Response<ErrorResponse>(400, "Validation error")
  public async updateAvailability(
    @Request() req: ExpressRequest,
    @Body() body: UpdateAvailabilityRequest
  ): Promise<AvailabilityResponse> {
    return availabilityService.updateAvailability(req.user!.id, body);
  }
}
