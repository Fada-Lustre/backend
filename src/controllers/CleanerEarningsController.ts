import { Body, Controller, Get, Post, Delete, Path, Query, Route, Tags, Security, Request, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as earningsService from "../services/cleaner-earnings.service";
import type { EarningsSummary, IncomeLine, WithdrawalLine, CreateWithdrawalRequest, WithdrawalResponse } from "../types/cleaner-earnings";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/earnings")
@Tags("Cleaner Earnings")
@Security("jwt", ["cleaner"])
export class CleanerEarningsController extends Controller {
  /**
   * Retrieve an earnings summary for the authenticated cleaner.
   * Includes total earned, pending, and available balance for the selected period.
   * @summary Get earnings summary
   */
  @Get("/")
  public async getSummary(
    @Request() req: ExpressRequest,
    @Query() period?: string,
    @Query() start?: string,
    @Query() end?: string
  ): Promise<EarningsSummary> {
    return earningsService.getSummary(req.user!.id, period ?? "this_week", start, end);
  }

  /**
   * List individual income transactions (completed booking payments)
   * with optional period filtering and pagination.
   * @summary List income history
   */
  @Get("income")
  public async getIncome(
    @Request() req: ExpressRequest,
    @Query() period?: string,
    @Query() start?: string,
    @Query() end?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<{ data: IncomeLine[]; total: number }> {
    return earningsService.listIncome(req.user!.id, period ?? "this_week", start, end, page ?? 1, limit ?? 20);
  }

  /**
   * List withdrawal transactions with optional period filtering and pagination.
   * @summary List withdrawal history
   */
  @Get("withdrawals")
  public async getWithdrawals(
    @Request() req: ExpressRequest,
    @Query() period?: string,
    @Query() start?: string,
    @Query() end?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<{ data: WithdrawalLine[]; total: number }> {
    return earningsService.listWithdrawals(req.user!.id, period ?? "this_week", start, end, page ?? 1, limit ?? 20);
  }
}

@Route("v1/cleaner/withdrawals")
@Tags("Cleaner Earnings")
@Security("jwt", ["cleaner"])
export class CleanerWithdrawalsController extends Controller {
  /**
   * Request a withdrawal of available earnings to the cleaner's bank account.
   * Requires PIN verification and sufficient balance.
   * @summary Request withdrawal
   */
  @Post("/")
  @SuccessResponse(201, "Withdrawal created")
  @Response<ErrorResponse>(400, "Validation error or insufficient balance")
  public async createWithdrawal(
    @Request() req: ExpressRequest,
    @Body() body: CreateWithdrawalRequest
  ): Promise<WithdrawalResponse> {
    this.setStatus(201);
    return earningsService.createWithdrawal(req.user!.id, body.amount, body.pin);
  }
}
