import { Body, Controller, Get, Post, Path, Query, Route, Tags, Security, Request, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as cleanerBookingService from "../services/cleaner-booking.service";
import type { CleanerBookingListItem, CleanerBookingDetail, CleanerRateRequest } from "../types/cleaner-booking";
import type { BookingImageResponse } from "../types/booking";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/bookings")
@Tags("Cleaner Bookings")
@Security("jwt", ["cleaner"])
export class CleanerBookingController extends Controller {
  @Get("/")
  public async listCleanerBookings(
    @Request() req: ExpressRequest,
    @Query() filter?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<{ data: CleanerBookingListItem[]; total: number }> {
    return cleanerBookingService.listBookings(req.user!.id, filter ?? "all", page ?? 1, limit ?? 20);
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Booking not found")
  @Response<ErrorResponse>(403, "Not assigned to this booking")
  public async getDetail(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<CleanerBookingDetail> {
    return cleanerBookingService.getBooking(req.user!.id, id);
  }

  @Post("{id}/start")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async start(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.startBooking(req.user!.id, id);
  }

  @Post("{id}/finish")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async finish(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.finishBooking(req.user!.id, id);
  }

  @Post("{id}/cancel")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async cancelCleanerBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.cancelBooking(req.user!.id, id);
  }

  @Post("{id}/rate")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Already rated or not done")
  @Response<ErrorResponse>(400, "Invalid rating")
  public async rateCleanerBooking(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: CleanerRateRequest
  ): Promise<{ id: string; rating: number }> {
    this.setStatus(201);
    return cleanerBookingService.rateCustomer(req.user!.id, id, body.rating, body.review);
  }
}
