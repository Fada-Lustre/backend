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
  @Get()
  public async adminListBookings(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() date?: string,
    @Query() location?: string,
    @Query() service?: string,
    @Query() status?: string,
    @Query() search?: string
  ): Promise<AdminListResponse<AdminBookingListItem>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminBookingService.listBookings(p, l, { date, location, service, status, search });
  }

  @Post()
  @SuccessResponse(201, "Created")
  public async adminCreateBooking(
    @Request() req: ExpressRequest,
    @Body() body: AdminCreateBookingRequest
  ): Promise<{ id: string; price: number; status: string }> {
    this.setStatus(201);
    return adminBookingService.createBooking(req.user!.id, body);
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getBooking(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminBookingDetail> {
    return adminBookingService.getBooking(id);
  }

  @Post("{id}/assign")
  @Response<ErrorResponse>(400, "Invalid state")
  public async assignCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminAssignRequest
  ): Promise<{ id: string; status: string; cleaner: { id: string; name: string } }> {
    return adminBookingService.assignCleaner(req.user!.id, id, body.cleaner_id);
  }

  @Patch("{id}/reschedule")
  @Response<ErrorResponse>(400, "Invalid state")
  public async rescheduleBooking(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminRescheduleRequest
  ): Promise<{ id: string; scheduled_date: string; time_start: string; time_end: string | null; status: string }> {
    return adminBookingService.rescheduleBooking(req.user!.id, id, body.date, body.start_time, body.end_time);
  }

  @Post("{id}/cancel")
  @Response<ErrorResponse>(400, "Invalid state")
  public async adminCancelBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; notifications_sent: string[] }> {
    return adminBookingService.cancelBooking(req.user!.id, id);
  }

  @Post("{id}/receipt")
  @Response<ErrorResponse>(404, "Not found")
  public async sendBookingReceipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<MessageResponse> {
    return adminBookingService.sendReceipt(req.user!.id, id);
  }
}
