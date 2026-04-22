import { Body, Controller, Get, Patch, Path, Post, Route, Tags, Response } from "tsoa";
import * as quotesService from "../services/quotes.service";
import type { PricingConfig, QuoteRequest, QuoteResponse, QuoteScheduleRequest, QuoteScheduleResponse } from "../types/quotes";
import type { ErrorResponse } from "../types/common";

@Route("v1")
@Tags("Quotes & Pricing")
export class QuotesController extends Controller {
  /**
   * Retrieve the current pricing configuration including hourly rates,
   * add-on prices, frequency discounts, and service fees.
   * @summary Get pricing config
   */
  @Get("pricing")
  public async getPricing(): Promise<PricingConfig> {
    return quotesService.getPricingConfig();
  }

  /**
   * Calculate an instant cleaning quote based on postcode, rooms, hours,
   * cleaning products preference, and frequency. Returns itemised line items and total.
   * @summary Create quote
   */
  @Post("quotes")
  @Response<ErrorResponse>(400, "Validation error")
  public async createQuote(@Body() body: QuoteRequest): Promise<QuoteResponse> {
    return quotesService.createQuote(body);
  }

  /**
   * Schedule a previously created quote by setting a preferred date and time slot.
   * Converts the quote into a bookable appointment.
   * @summary Schedule quote
   */
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
