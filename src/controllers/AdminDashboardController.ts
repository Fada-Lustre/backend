import { Controller, Get, Route, Tags, Security, Request, Query } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminDashboardService from "../services/admin-dashboard.service";
import type {
  DashboardResponse,
  DashboardStatsResponse,
  DashboardUpcomingResponse,
  DashboardTransactionsResponse,
} from "../types/admin-dashboard";

@Route("v1/admin/dashboard")
@Tags("Admin Dashboard")
@Security("jwt", ["admin:home"])
export class AdminDashboardController extends Controller {
  /**
   * Retrieve the admin dashboard summary including balance, pending amounts,
   * total bookings, top clients/cleaners, upcoming bookings by service,
   * service counts, and recent transactions.
   * @summary Get dashboard overview
   * @param period Filter stats by time period: today, this_month, past_3_months, past_6_months, past_year, all_time
   * @param week_start ISO date for upcoming bookings week start (default: current Monday)
   * @param week_end ISO date for upcoming bookings week end (default: current Sunday)
   * @param tx_page Page number for recent transactions (default: 1)
   * @param tx_limit Items per page for recent transactions (default: 10)
   * @param tx_type Filter transactions: all, booking, payout
   */
  @Get()
  public async getDashboard(
    @Request() _req: ExpressRequest,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time",
    @Query() week_start?: string,
    @Query() week_end?: string,
    @Query() tx_page?: number,
    @Query() tx_limit?: number,
    @Query() tx_type?: "all" | "booking" | "payout"
  ): Promise<DashboardResponse> {
    return adminDashboardService.getDashboard({ period, week_start, week_end, tx_page, tx_limit, tx_type });
  }

  /**
   * Aggregate stats: balance, pending, total bookings, top clients/cleaners,
   * service counts. Filter by an explicit date range (from/to) OR a relative period.
   * @summary Dashboard stats
   * @param period Relative period (ignored when from/to provided)
   * @param from ISO date range start (filters on created_at)
   * @param to ISO date range end (filters on created_at)
   */
  @Get("stats")
  public async getStats(
    @Request() _req: ExpressRequest,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time",
    @Query() from?: string,
    @Query() to?: string
  ): Promise<DashboardStatsResponse> {
    return adminDashboardService.getStats({ period, from, to });
  }

  /**
   * Upcoming bookings grouped by service, filtered by scheduled_date range.
   * @summary Dashboard upcoming bookings
   * @param week_start ISO date for range start (filters on scheduled_date)
   * @param week_end ISO date for range end (filters on scheduled_date)
   */
  @Get("upcoming-bookings")
  public async getUpcoming(
    @Request() _req: ExpressRequest,
    @Query() week_start?: string,
    @Query() week_end?: string
  ): Promise<DashboardUpcomingResponse> {
    return adminDashboardService.getUpcoming({ week_start, week_end });
  }

  /**
   * Paginated transactions, filterable by type (booking/payout) and date range.
   * @summary Dashboard transactions
   * @param tx_type Filter transactions: all, booking, payout
   * @param from ISO date range start (filters on created_at)
   * @param to ISO date range end (filters on created_at)
   * @param tx_page Page number (default: 1)
   * @param tx_limit Items per page (default: 10)
   * @param period Relative period (ignored when from/to provided)
   */
  @Get("transactions")
  public async getTransactions(
    @Request() _req: ExpressRequest,
    @Query() tx_type?: "all" | "booking" | "payout",
    @Query() from?: string,
    @Query() to?: string,
    @Query() tx_page?: number,
    @Query() tx_limit?: number,
    @Query() period?: "today" | "this_month" | "past_3_months" | "past_6_months" | "past_year" | "all_time"
  ): Promise<DashboardTransactionsResponse> {
    return adminDashboardService.getTransactions({ period, from, to, tx_type, tx_page, tx_limit });
  }
}
