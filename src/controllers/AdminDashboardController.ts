import { Controller, Get, Route, Tags, Security, Request, Query } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminDashboardService from "../services/admin-dashboard.service";
import type { DashboardResponse } from "../types/admin-dashboard";

@Route("v1/admin/dashboard")
@Tags("Admin Dashboard")
@Security("jwt", ["admin:home"])
export class AdminDashboardController extends Controller {
  @Get()
  public async getDashboard(@Request() _req: ExpressRequest): Promise<DashboardResponse> {
    return adminDashboardService.getDashboard();
  }
}
