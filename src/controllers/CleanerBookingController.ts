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
  /**
   * List bookings assigned to the authenticated cleaner.
   * Supports filtering by status (upcoming, ongoing, completed, all).
   * @summary List my assigned bookings
   */
  @Get("/")
  public async listCleanerBookings(
    @Request() req: ExpressRequest,
    @Query() filter?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<{ data: CleanerBookingListItem[]; total: number }> {
    return cleanerBookingService.listBookings(req.user!.id, filter ?? "all", page ?? 1, limit ?? 20);
  }

  /**
   * Retrieve detailed booking information including customer details,
   * address with entrance notes, and service requirements.
   * @summary Get booking details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Booking not found")
  @Response<ErrorResponse>(403, "Not assigned to this booking")
  public async getDetail(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<CleanerBookingDetail> {
    return cleanerBookingService.getBooking(req.user!.id, id);
  }

  /**
   * Mark a scheduled booking as started. Transitions status to 'ongoing'.
   * Only the assigned cleaner can start their bookings.
   * @summary Start booking
   */
  @Post("{id}/start")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async start(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.startBooking(req.user!.id, id);
  }

  /**
   * Mark an ongoing booking as finished. Transitions status to 'done'.
   * Triggers earnings calculation for the cleaner.
   * @summary Finish booking
   */
  @Post("{id}/finish")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async finish(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.finishBooking(req.user!.id, id);
  }

  /**
   * Cancel an assigned booking from the cleaner side.
   * The booking returns to 'unassigned' for reassignment.
   * @summary Cancel booking (cleaner)
   */
  @Post("{id}/cancel")
  @Response<ErrorResponse>(409, "Invalid state transition")
  @Response<ErrorResponse>(403, "Not assigned")
  public async cancelCleanerBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string }> {
    return cleanerBookingService.cancelBooking(req.user!.id, id);
  }

  /**
   * Rate the customer after a completed booking.
   * Rating must be 1-5. Only allowed for bookings with status 'done'.
   * @summary Rate customer
   */
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
