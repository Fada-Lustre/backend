import { Controller, Get, Post, Patch, Route, Tags, Security, Request, Body, Path, Query, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as bookingService from "../services/booking.service";
import type {
  CreateBookingRequest, BookingListItem, BookingDetail,
  PayBookingRequest, PayBookingResponse,
  AmendBookingRequest, RescheduleBookingRequest, RateBookingRequest,
  BookingImageResponse, ReceiptResponse,
} from "../types/booking";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/bookings")
@Tags("Bookings")
@Security("jwt", ["customer"])
export class BookingController extends Controller {
  @Post("/")
  @SuccessResponse(201, "Created")
  public async createBooking(
    @Request() req: ExpressRequest,
    @Body() body: CreateBookingRequest
  ): Promise<{ id: string; status: string; price: string | null }> {
    this.setStatus(201);
    return bookingService.createBooking(req.user!.id, body);
  }

  @Get("/")
  public async listBookings(
    @Request() req: ExpressRequest,
    @Query() status?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<BookingListItem>> {
    const p = page ?? 1;
    const l = Math.min(limit ?? 20, 100);
    const result = await bookingService.listBookings(req.user!.id, status ?? "all", p, l);
    return { data: result.data, meta: { total: result.total, page: p, limit: l } };
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async get(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<BookingDetail> {
    return bookingService.getBooking(req.user!.id, id, req.user!.role);
  }

  @Post("{id}/pay")
  @Response<ErrorResponse>(409, "Already paid")
  public async pay(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: PayBookingRequest
  ): Promise<PayBookingResponse> {
    return bookingService.payBooking(req.user!.id, id, body.method, body.tip ?? 0);
  }

  @Patch("{id}/amend")
  @Response<ErrorResponse>(409, "State conflict")
  public async amend(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AmendBookingRequest
  ): Promise<{ id: string; amendment_id: string }> {
    return bookingService.amendBooking(req.user!.id, id, body);
  }

  @Patch("{id}/reschedule")
  @Response<ErrorResponse>(409, "State conflict")
  public async reschedule(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: RescheduleBookingRequest
  ): Promise<{ id: string; new_date: string; new_time: string }> {
    return bookingService.rescheduleBooking(req.user!.id, id, body.date, body.time);
  }

  @Post("{id}/cancel")
  @Response<ErrorResponse>(409, "State conflict")
  public async cancelBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; refund_status: string }> {
    return bookingService.cancelBooking(req.user!.id, id);
  }

  @Post("{id}/rebook")
  @SuccessResponse(201, "Created")
  public async rebook(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; cloned_from: string }> {
    this.setStatus(201);
    return bookingService.rebookBooking(req.user!.id, id);
  }

  @Post("{id}/rate")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(409, "Already rated")
  public async rateBooking(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: RateBookingRequest
  ): Promise<{ id: string; rating: number }> {
    this.setStatus(201);
    return bookingService.rateBooking(req.user!.id, id, body.rating, body.review);
  }

  @Post("{id}/change-cleaner")
  public async changeCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ success: boolean; new_cleaner?: { id: string; name: string; rating: number | null }; message?: string }> {
    return bookingService.changeCleaner(req.user!.id, id);
  }

  @Get("{id}/images")
  @Security("jwt", ["customer", "cleaner", "admin:bookings"])
  public async images(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ data: BookingImageResponse[] }> {
    const data = await bookingService.getImages(req.user!.id, id, req.user!.role);
    return { data };
  }

  @Get("{id}/receipt")
  public async receipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<ReceiptResponse> {
    return bookingService.getReceipt(req.user!.id, id);
  }
}
