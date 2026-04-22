import { Body, Controller, Delete, Get, Path, Post, Route, Tags, Security, Request, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as cleanerPaymentMethodService from "../services/cleaner-payment-method.service";
import type { CleanerPaymentMethodResponse, CreateCleanerPaymentMethodRequest } from "../types/cleaner-payment-method";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/payment-methods")
@Tags("Cleaner Payment Methods")
@Security("jwt", ["cleaner"])
export class CleanerPaymentMethodController extends Controller {
  /**
   * List all saved bank accounts for the authenticated cleaner.
   * Used for receiving earnings withdrawals.
   * @summary List bank accounts
   */
  @Get("/")
  public async listCleanerPaymentMethods(
    @Request() req: ExpressRequest
  ): Promise<CleanerPaymentMethodResponse[]> {
    return cleanerPaymentMethodService.list(req.user!.id);
  }

  /**
   * Add a new bank account for receiving earnings withdrawals.
   * @summary Add bank account
   */
  @Post("/")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  public async createCleanerPaymentMethod(
    @Request() req: ExpressRequest,
    @Body() body: CreateCleanerPaymentMethodRequest
  ): Promise<CleanerPaymentMethodResponse> {
    this.setStatus(201);
    return cleanerPaymentMethodService.create(req.user!.id, body);
  }

  /**
   * Remove a saved bank account. Only the owner can delete their accounts.
   * @summary Remove bank account
   */
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  @Response<ErrorResponse>(403, "Forbidden")
  @Response<ErrorResponse>(404, "Payment method not found")
  public async removeCleanerPaymentMethod(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await cleanerPaymentMethodService.remove(req.user!.id, id);
    this.setStatus(204);
  }
}
