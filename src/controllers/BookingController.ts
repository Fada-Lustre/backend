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
  /**
   * Create a new cleaning booking. Requires an address, service type, property details,
   * and preferred date/time. The booking starts in 'unassigned' status.
   * @summary Create booking
   */
  @Post("/")
  @SuccessResponse(201, "Created")
  public async createBooking(
    @Request() req: ExpressRequest,
    @Body() body: CreateBookingRequest
  ): Promise<{ id: string; status: string; price: string | null }> {
    this.setStatus(201);
    return bookingService.createBooking(req.user!.id, body);
  }

  /**
   * List the authenticated customer's bookings with optional status filter
   * and pagination. Returns bookings sorted by scheduled date.
   * @summary List my bookings
   */
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

  /**
   * Retrieve detailed information about a specific booking including
   * cleaner info, payment status, and service details.
   * @summary Get booking details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async get(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<BookingDetail> {
    return bookingService.getBooking(req.user!.id, id, req.user!.role);
  }

  /**
   * Submit payment for a booking. Supports cash and card methods.
   * Optional tip amount can be included.
   * @summary Pay for booking
   */
  @Post("{id}/pay")
  @Response<ErrorResponse>(409, "Already paid")
  public async pay(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: PayBookingRequest
  ): Promise<PayBookingResponse> {
    return bookingService.payBooking(req.user!.id, id, body.method, body.tip ?? 0);
  }

  /**
   * Request changes to a booking's details (e.g. room count, additional info).
   * Creates an amendment record for tracking.
   * @summary Amend booking
   */
  @Patch("{id}/amend")
  @Response<ErrorResponse>(409, "State conflict")
  public async amend(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AmendBookingRequest
  ): Promise<{ id: string; amendment_id: string }> {
    return bookingService.amendBooking(req.user!.id, id, body);
  }

  /**
   * Reschedule a booking to a new date and time.
   * Only allowed for bookings not yet started.
   * @summary Reschedule booking
   */
  @Patch("{id}/reschedule")
  @Response<ErrorResponse>(409, "State conflict")
  public async reschedule(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: RescheduleBookingRequest
  ): Promise<{ id: string; new_date: string; new_time: string }> {
    return bookingService.rescheduleBooking(req.user!.id, id, body.date, body.time);
  }

  /**
   * Cancel a booking. Refund eligibility depends on the cancellation timing
   * relative to the scheduled date.
   * @summary Cancel booking
   */
  @Post("{id}/cancel")
  @Response<ErrorResponse>(409, "State conflict")
  public async cancelBooking(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; refund_status: string }> {
    return bookingService.cancelBooking(req.user!.id, id);
  }

  /**
   * Create a new booking by cloning a previously cancelled or completed booking.
   * Copies the original service details and address.
   * @summary Rebook previous booking
   */
  @Post("{id}/rebook")
  @SuccessResponse(201, "Created")
  public async rebook(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ id: string; status: string; cloned_from: string }> {
    this.setStatus(201);
    return bookingService.rebookBooking(req.user!.id, id);
  }

  /**
   * Rate and review the cleaner after a completed booking.
   * Rating must be 1-5. Only allowed for bookings with status 'done'.
   * @summary Rate booking
   */
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

  /**
   * Request a different cleaner for a scheduled booking.
   * The system attempts to find an available replacement.
   * @summary Request cleaner change
   */
  @Post("{id}/change-cleaner")
  public async changeCleaner(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ success: boolean; new_cleaner?: { id: string; name: string; rating: number | null }; message?: string }> {
    return bookingService.changeCleaner(req.user!.id, id);
  }

  /**
   * Retrieve before/after images uploaded for a booking.
   * Accessible by the customer, assigned cleaner, and admins.
   * @summary Get booking images
   */
  @Get("{id}/images")
  @Security("jwt", ["customer", "cleaner", "admin:bookings"])
  public async images(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<{ data: BookingImageResponse[] }> {
    const data = await bookingService.getImages(req.user!.id, id, req.user!.role);
    return { data };
  }

  /**
   * Retrieve the receipt for a booking including service details,
   * pricing breakdown, and payment status.
   * @summary Get booking receipt
   */
  @Get("{id}/receipt")
  public async receipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<ReceiptResponse> {
    return bookingService.getReceipt(req.user!.id, id);
  }
}
