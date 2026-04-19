import { Body, Controller, Post, Get, Patch, Path, Route, Tags, Response, SuccessResponse, Security } from "tsoa";
import * as leadsService from "../services/leads.service";
import type {
  ContactMessageRequest, ContactMessageResponse,
  ServiceRequestBody, ServiceRequestResponse,
  CleanerApplicationRequest, CleanerApplicationResponse,
  CleanerApplicationDetail, UpdateCleanerApplicationRequest,
} from "../types/leads";
import type { ErrorResponse } from "../types/common";

@Route("v1/contact-messages")
@Tags("Contact")
export class ContactController extends Controller {
  @Post("/")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitContactMessage(
    @Body() body: ContactMessageRequest
  ): Promise<ContactMessageResponse> {
    this.setStatus(201);
    return leadsService.submitContactMessage(body);
  }
}

@Route("v1/service-requests")
@Tags("Service Requests")
export class ServiceRequestsController extends Controller {
  @Post("/")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitServiceRequest(
    @Body() body: ServiceRequestBody
  ): Promise<ServiceRequestResponse> {
    this.setStatus(201);
    return leadsService.submitServiceRequest(body);
  }
}

@Route("v1/cleaner-applications")
@Tags("Cleaner Applications")
export class CleanerApplicationsController extends Controller {
  @Post("/")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitApplication(
    @Body() body: CleanerApplicationRequest
  ): Promise<CleanerApplicationResponse> {
    this.setStatus(201);
    return leadsService.submitCleanerApplication(body);
  }

  @Get("{id}")
  @Security("jwt", ["customer", "admin:all_users"])
  @Response<ErrorResponse>(404, "Not found")
  public async getApplication(
    @Path() id: string
  ): Promise<CleanerApplicationDetail> {
    return leadsService.getCleanerApplication(id);
  }

  @Patch("{id}")
  @Security("jwt", ["customer"])
  @Response<ErrorResponse>(404, "Not found")
  @Response<ErrorResponse>(409, "Not in draft status")
  public async updateApplication(
    @Path() id: string,
    @Body() body: UpdateCleanerApplicationRequest
  ): Promise<CleanerApplicationDetail> {
    return leadsService.updateCleanerApplication(id, body);
  }
}
