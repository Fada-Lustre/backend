import { Body, Controller, Get, Patch, Path, Post, Route, Tags, Response } from "tsoa";
import * as quotesService from "../services/quotes.service";
import type { PricingConfig, QuoteRequest, QuoteResponse, QuoteScheduleRequest, QuoteScheduleResponse } from "../types/quotes";
import type { ErrorResponse } from "../types/common";

@Route("v1")
@Tags("Quotes & Pricing")
export class QuotesController extends Controller {
  @Get("pricing")
  public async getPricing(): Promise<PricingConfig> {
    return quotesService.getPricingConfig();
  }

  @Post("quotes")
  @Response<ErrorResponse>(400, "Validation error")
  public async createQuote(@Body() body: QuoteRequest): Promise<QuoteResponse> {
    return quotesService.createQuote(body);
  }

  @Patch("quotes/{id}/schedule")
  @Response<ErrorResponse>(400, "Validation error")
  @Response<ErrorResponse>(404, "Quote not found")
  public async scheduleQuote(
    @Path() id: string,
    @Body() body: QuoteScheduleRequest
  ): Promise<QuoteScheduleResponse> {
    return quotesService.scheduleQuote(id, body);
  }
}
