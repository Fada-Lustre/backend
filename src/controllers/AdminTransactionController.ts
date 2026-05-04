import { Controller, Get, Post, Route, Tags, Security, Request, Query, Path, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminTransactionService from "../services/admin-transaction.service";
import { clampPagination } from "../lib/validation";
import type { AdminTransactionDetail } from "../types/admin-transaction";
import type { ErrorResponse, MessageResponse } from "../types/common";
import type { AdminListResponse } from "../types/admin-common";

@Route("v1/admin/transactions")
@Tags("Admin Transactions")
@Security("jwt", ["admin:transactions"])
export class AdminTransactionController extends Controller {
  /**
   * List all financial transactions with filters for period, type,
   * and text search. Includes aggregate stats.
   * @summary List transactions
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 10)
   * @param period Filter by date: today, this_month, past_3_months, past_6_months, past_year, all_time
   * @param type Filter by type: booking, payout
   * @param search Search by reference or name
   * @param location Filter by booking address (partial match)
   * @param service Filter by service type
   */
  @Get()
  public async listTransactions(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time",
    @Query() type?: "booking" | "payout",
    @Query() search?: string,
    @Query() location?: string,
    @Query() service?: string
  ): Promise<AdminListResponse<Record<string, unknown>>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminTransactionService.listTransactions(p, l, { period, type, search, location, service });
  }

  /**
   * Export transactions as a CSV file. Accepts the same filters as the list endpoint.
   * @summary Export transactions CSV
   * @param period Filter by date: today, this_month, past_3_months, past_6_months, past_year, all_time
   * @param type Filter by type: booking, payout
   * @param search Search by reference or name
   * @param location Filter by booking address (partial match)
   * @param service Filter by service type
   */
  @Get("export")
  @SuccessResponse(200, "CSV file")
  public async exportTransactionsCsv(
    @Request() req: ExpressRequest,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time",
    @Query() type?: "booking" | "payout",
    @Query() search?: string,
    @Query() location?: string,
    @Query() service?: string
  ): Promise<void> {
    const { data } = await adminTransactionService.listTransactions(1, 10000, {
      period, type, search, location, service,
    });
    const csv = adminTransactionService.buildTransactionCsv(data);

    const res = (req as any).res as import("express").Response;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.csv");
    res.status(200).send(csv);
  }

  /**
   * Retrieve full transaction details including linked booking and user info.
   * @summary Get transaction details
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getTransaction(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminTransactionDetail> {
    return adminTransactionService.getTransaction(id) as unknown as Promise<AdminTransactionDetail>;
  }

  /**
   * Send or resend the transaction receipt to the associated user's email.
   * @summary Send transaction receipt
   */
  @Post("{id}/receipt")
  @Response<ErrorResponse>(404, "Not found")
  public async sendTransactionReceipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<MessageResponse> {
    return adminTransactionService.sendReceipt(req.user!.id, id);
  }
}
