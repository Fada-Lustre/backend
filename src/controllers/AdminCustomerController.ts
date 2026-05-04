import { Controller, Get, Post, Route, Tags, Security, Request, Query, Path, Body, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminCustomerService from "../services/admin-customer.service";
import * as adminBookingService from "../services/admin-booking.service";
import { clampPagination } from "../lib/validation";
import type { AdminCreateBookingRequest } from "../types/admin-booking";
import type { AdminCustomerDetail } from "../types/admin-customer";
import type { ErrorResponse, IdStatusResponse } from "../types/common";
import type { AdminListResponse } from "../types/admin-common";

@Route("v1/admin/customers")
@Tags("Admin Customers")
@Security("jwt", ["admin:customers"])
export class AdminCustomerController extends Controller {
  /**
   * List all customers with filters for status, location, service type,
   * and text search. Includes aggregate stats.
   * @summary List customers
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param status Filter by status: active, inactive, blocked
   * @param location Filter by address (partial match)
   * @param service Filter by service type booked
   * @param search Search by name, email, or phone
   * @param period Filter by join date: today, this_month, past_3_months, past_6_months, past_year, all_time
   */
  @Get()
  public async listCustomers(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() status?: "active" | "inactive" | "blocked",
    @Query() location?: string,
    @Query() service?: string,
    @Query() search?: string,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time"
  ): Promise<AdminListResponse<Record<string, unknown>>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminCustomerService.listCustomers(p, l, { status, location, service, search, period });
  }

  /**
   * Retrieve detailed customer information including booking history,
   * reviews, services booked, booking frequency, and last payment method.
   * @summary Get customer details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getCustomer(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminCustomerDetail> {
    return adminCustomerService.getCustomer(id) as unknown as Promise<AdminCustomerDetail>;
  }

  /**
   * Block a customer account, preventing them from logging in or making bookings.
   * @summary Block customer
   */
  @Post("{id}/block")
  @Response<ErrorResponse>(404, "Not found")
  public async blockCustomer(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<IdStatusResponse> {
    return adminCustomerService.blockCustomer(req.user!.id, id);
  }

  /**
   * Create a booking on behalf of a specific customer.
   * @summary Book for customer
   */
  @Post("{id}/book")
  @SuccessResponse(201, "Created")
  public async bookForCustomer(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminCreateBookingRequest
  ): Promise<{ id: string; price: number; status: string }> {
    this.setStatus(201);
    return adminBookingService.createBookingForCustomer(req.user!.id, id, body);
  }
}
