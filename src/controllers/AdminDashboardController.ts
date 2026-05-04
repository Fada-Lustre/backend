import { Controller, Get, Route, Tags, Security, Request, Query } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminDashboardService from "../services/admin-dashboard.service";
import type { DashboardResponse } from "../types/admin-dashboard";

@Route("v1/admin/dashboard")
@Tags("Admin Dashboard")
@Security("jwt", ["admin:home"])
export class AdminDashboardController extends Controller {
  /**
   * Retrieve the admin dashboard summary including balance, pending amounts,
   * total bookings, top clients/cleaners, upcoming bookings by service,
   * service counts, and recent transactions.
   * @summary Get dashboard overview
   */
  @Get()
  public async getDashboard(
    @Request() _req: ExpressRequest,
    @Query() period?: string,
    @Query() week_start?: string,
    @Query() week_end?: string,
    @Query() tx_page?: number,
    @Query() tx_limit?: number,
    @Query() tx_type?: string
  ): Promise<DashboardResponse> {
    return adminDashboardService.getDashboard({ period, week_start, week_end, tx_page, tx_limit, tx_type });
  }
}
