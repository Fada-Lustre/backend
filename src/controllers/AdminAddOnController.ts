import { Controller, Get, Route, Tags, Security, Request } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as adminAddOnService from "../services/admin-addon.service";
import type { AdminAddOn } from "../types/admin-addon";
import type { ListResponse } from "../types/common";

@Route("v1/admin/add-ons")
@Tags("Admin Add-ons")
@Security("jwt", ["admin:services"])
export class AdminAddOnController extends Controller {
  /**
   * List all add-ons (active and inactive) with presigned image URLs.
   * Use the id from this list with POST /v1/admin/add-ons/{id}/image to upload artwork.
   * @summary List add-ons
   */
  @Get()
  public async listAddOns(@Request() _req: ExpressRequest): Promise<ListResponse<AdminAddOn>> {
    return adminAddOnService.listAddOns();
  }
}
