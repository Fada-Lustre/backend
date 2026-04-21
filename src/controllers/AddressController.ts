import { Controller, Get, Post, Put, Delete, Route, Tags, Security, Request, Body, Path, SuccessResponse, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as addressService from "../services/address.service";
import type { CreateAddressRequest, UpdateAddressRequest, AddressResponse } from "../types/address";
import type { ErrorResponse } from "../types/common";

@Route("v1/customer/addresses")
@Tags("Addresses")
@Security("jwt", ["customer"])
export class AddressController extends Controller {
  @Get("/")
  public async list(@Request() req: ExpressRequest): Promise<{ data: AddressResponse[] }> {
    const data = await addressService.list(req.user!.id);
    return { data };
  }

  @Get("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async getById(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<AddressResponse> {
    return addressService.getById(req.user!.id, id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  public async create(
    @Request() req: ExpressRequest,
    @Body() body: CreateAddressRequest
  ): Promise<AddressResponse> {
    this.setStatus(201);
    return addressService.create(req.user!.id, body);
  }

  @Put("{id}")
  @Response<ErrorResponse>(404, "Not found")
  public async update(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: UpdateAddressRequest
  ): Promise<AddressResponse> {
    return addressService.update(req.user!.id, id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "No content")
  @Response<ErrorResponse>(404, "Not found")
  public async remove(
    @Request() req: ExpressRequest,
    @Path() id: string
  ): Promise<void> {
    await addressService.remove(req.user!.id, id);
    this.setStatus(204);
  }
}
