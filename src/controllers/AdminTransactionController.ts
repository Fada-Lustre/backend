import { Controller, Get, Post, Route, Tags, Security, Request, Query, Path, Response } from "tsoa";
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
  @Get()
  public async listTransactions(
    @Request() _req: ExpressRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() period?: string,
    @Query() type?: string,
    @Query() search?: string
  ): Promise<AdminListResponse<Record<string, unknown>>> {
    const { page: p, limit: l } = clampPagination(page, limit);
    return adminTransactionService.listTransactions(p, l, { period, type, search });
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getTransaction(
    @Request() _req: ExpressRequest,
    @Path() id: string
  ): Promise<AdminTransactionDetail> {
    return adminTransactionService.getTransaction(id) as unknown as Promise<AdminTransactionDetail>;
  }

  @Post("{id}/receipt")
  @Response<ErrorResponse>(404, "Not found")
  public async sendReceipt(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<MessageResponse> {
    return adminTransactionService.sendReceipt(req.user!.id, id);
  }
}
