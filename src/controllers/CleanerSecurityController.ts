import { Body, Controller, Patch, Route, Tags, Security, Request, Response } from "tsoa";
import { Request as ExpressRequest } from "express";
import * as securityService from "../services/cleaner-security.service";
import type { ChangePinRequest, ChangePinResponse } from "../types/cleaner-security";
import type { ErrorResponse } from "../types/common";

@Route("v1/cleaner/security")
@Tags("Cleaner Security")
@Security("jwt", ["cleaner"])
export class CleanerSecurityController extends Controller {
  /**
   * Change the cleaner's 4-digit PIN used for withdrawal verification.
   * Requires the current PIN and matching new/confirm PIN.
   * @summary Change withdrawal PIN
   */
  @Patch("pin")
  @Response<ErrorResponse>(400, "Invalid PIN or mismatch")
  public async changePin(
    @Request() req: ExpressRequest,
    @Body() body: ChangePinRequest
  ): Promise<ChangePinResponse> {
    return securityService.changePin(req.user!.id, body.old_pin, body.new_pin, body.confirm_pin);
  }
}
