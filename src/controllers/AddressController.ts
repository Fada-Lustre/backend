import { Controller, Get, Post, Put, Delete, Route, Tags, Security, Request, Body, Path, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as addressService from "../services/address.service";
import type { CreateAddressRequest, UpdateAddressRequest, AddressResponse } from "../types/address";
import type { ErrorResponse } from "../types/common";

@Route("v1/customer/addresses")
@Tags("Addresses")
@Security("jwt", ["customer"])
export class AddressController extends Controller {
  /**
   * List all saved addresses for the authenticated customer.
   * @summary List my addresses
   */
  @Get("/")
  public async listAddresses(@Request() req: ExpressRequest): Promise<{ data: AddressResponse[] }> {
    const data = await addressService.list(req.user!.id);
    return { data };
  }

  /**
   * Retrieve a single saved address by its ID.
   * @summary Get address by ID
   */
  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<AddressResponse> {
    return addressService.getById(req.user!.id, id);
  }

  /**
   * Save a new address to the customer's address book.
   * Includes street, floor, door number, and optional entrance notes.
   * @summary Create address
   */
  @Post("/")
  @SuccessResponse(201, "Created")
  public async createAddress(
    @Request() req: ExpressRequest,
    @Body() body: CreateAddressRequest
  ): Promise<AddressResponse> {
    this.setStatus(201);
    return addressService.create(req.user!.id, body);
  }

  /**
   * Update an existing address. All provided fields are overwritten.
   * @summary Update address
   */
  @Put("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async update(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateAddressRequest
  ): Promise<AddressResponse> {
    return addressService.update(req.user!.id, id, body);
  }

  /**
   * Soft-delete an address from the customer's address book.
   * The address is retained in the database for booking history.
   * @summary Delete address
   */
  @Delete("{id}")
  @SuccessResponse(204, "No content")
  @Response<ErrorResponse>(404, "Not found")
  public async removeAddress(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await addressService.remove(req.user!.id, id);
    this.setStatus(204);
  }
}
