import { Body, Controller, Delete, Get, Path, Post, Route, Tags, Security, Request, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as cleanerPaymentMethodService from "../services/cleaner-payment-method.service";
import type { CleanerPaymentMethodResponse, CreateCleanerPaymentMethodRequest } from "../types/cleaner-payment-method";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/payment-methods")
@Tags("Cleaner Payment Methods")
@Security("jwt", ["cleaner"])
export class CleanerPaymentMethodController extends Controller {
  @Get("/")
  public async list(
    @Request() req: ExpressRequest
  ): Promise<CleanerPaymentMethodResponse[]> {
    return cleanerPaymentMethodService.list(req.user!.id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  public async create(
    @Request() req: ExpressRequest,
    @Body() body: CreateCleanerPaymentMethodRequest
  ): Promise<CleanerPaymentMethodResponse> {
    this.setStatus(201);
    return cleanerPaymentMethodService.create(req.user!.id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  @Response<ErrorResponse>(403, "Forbidden")
  @Response<ErrorResponse>(404, "Payment method not found")
  public async remove(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await cleanerPaymentMethodService.remove(req.user!.id, id);
    this.setStatus(204);
  }
}
