import { Body, Controller, Delete, Get, Path, Post, Route, Tags, Security, Request, Response, SuccessResponse } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as paymentMethodService from "../services/payment-method.service";
import type { PaymentMethodResponse, CreatePaymentMethodRequest } from "../types/payment-method";
import type { ErrorResponse } from "../types/common";

@Route("v1/customer/payment-methods")
@Tags("Payment Methods")
@Security("jwt", ["customer"])
export class PaymentMethodController extends Controller {
  @Get("/")
  public async listPaymentMethods(
    @Request() req: ExpressRequest
  ): Promise<PaymentMethodResponse[]> {
    return paymentMethodService.list(req.user!.id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  public async createPaymentMethod(
    @Request() req: ExpressRequest,
    @Body() body: CreatePaymentMethodRequest
  ): Promise<PaymentMethodResponse> {
    this.setStatus(201);
    return paymentMethodService.create(req.user!.id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  @Response<ErrorResponse>(403, "Forbidden")
  @Response<ErrorResponse>(404, "Payment method not found")
  public async removePaymentMethod(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await paymentMethodService.remove(req.user!.id, id);
    this.setStatus(204);
  }
}
