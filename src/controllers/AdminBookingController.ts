import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Query, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminBookingService from "../services/admin-booking.service";
import { clampPagination } from "../lib/validation";
import type { AdminCreateBookingRequest, AdminAssignRequest, AdminRescheduleRequest, AdminBookingListItem, AdminBookingDetail } from "../types/admin-booking";
import type { ErrorResponse, MessageResponse } from "../types/common";
import type { AdminListResponse } from "../types/admin-common";

@Route("v1/admin/bookings")
@Tags("Admin Bookings")
@Security("jwt", ["admin:bookings"])
export class AdminBookingController extends Controller {
  /**
   * List all bookings with filters for date, location, service type, and status.
   * Includes aggregate stats (total, scheduled, completed, cancelled).
   * @summary List all bookings
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param date Filter by scheduled date (YYYY-MM-DD)
   * @param location Filter by address (partial match)
   * @param service Filter by service type
   * @param status Filter by booking status
   * @param search Search by customer name or reference
   */
  @Get()
  public async adminListBookings(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() date?: string,
    @Query() location?: string,
    @Query() service?: string,
    @Query() status?: "unassigned" | "scheduled" | "in_progress" | "done" | "cancelled",
    @Query() search?: string
  ): Promise<AdminListResponse<AdminBookingListItem>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminBookingService.listBookings(p, l, { date, location, service, status, search });
  }

  /**
   * Create a booking on behalf of a customer. Used when admins receive
   * phone or in-person booking requests.
   * @summary Create booking (admin)
   */
  @Post()
  @SuccessResponse(201, "Created")
  public async adminCreateBooking(
    @Request() req: ExpressRequest,
    @Body() body: AdminCreateBookingRequest
  ): Promise<{ id: string; price: number; status: string }> {
    this.setStatus(201);
    return adminBookingService.createBooking(req.user!.id, body);
  }

  /**
   * Get presigned download URLs for all images attached to a booking.
   * @summary Get booking image download URLs
   */
  @Get("{id}/images/download")
  @Response<ErrorResponse>(404, "Not found")
  public async downloadBookingImages(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<{ images: { filename: string; url: string }[] }> {
    return adminBookingService.getImageDownloadUrls(id);
  }

  /**
   * Retrieve full booking details including customer/cleaner info,
   * property details, payment status, and uploaded images.
   * @summary Get booking details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getBooking(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminBookingDetail> {
    return adminBookingService.getBooking(id);
  }

  /**
   * Assign a cleaner to an unassigned booking. Transitions status to 'scheduled'
   * and sends notifications to both parties.
   * @summary Assign cleaner to booking
   */
  @Post("{id}/assign")
  @Response<ErrorResponse>(400, "Invalid state")
  public async assignCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminAssignRequest
  ): Promise<{ id: string; status: string; cleaner: { id: string; name: string } }> {
    return adminBookingService.assignCleaner(req.user!.id, id, body.cleaner_id);
  }

  /**
   * Reschedule a booking to a new date and time on behalf of the customer.
   * @summary Reschedule booking (admin)
   */
  @Patch("{id}/reschedule")
  @Response<ErrorResponse>(400, "Invalid state")
  public async rescheduleBooking(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminRescheduleRequest
  ): Promise<{ id: string; scheduled_date: string; time_start: string; time_end: string | null; status: string }> {
    return adminBookingService.rescheduleBooking(req.user!.id, id, body.date, body.start_time, body.end_time);
  }

  /**
   * Cancel a booking and notify the customer and assigned cleaner.
   * @summary Cancel booking (admin)
   */
  @Post("{id}/cancel")
  @Response<ErrorResponse>(400, "Invalid state")
  public async adminCancelBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; notifications_sent: string[] }> {
    return adminBookingService.cancelBooking(req.user!.id, id);
  }

  /**
   * Send or resend the booking receipt to the customer's email.
   * @summary Send booking receipt
   */
  @Post("{id}/receipt")
  @Response<ErrorResponse>(404, "Not found")
  public async sendBookingReceipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<MessageResponse> {
    return adminBookingService.sendReceipt(req.user!.id, id);
  }
}
