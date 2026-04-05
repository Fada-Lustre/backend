import { Body, Controller, Post, Route, Tags, Response } from "tsoa";
import db from "../db";
import type {
  ContactMessageRequest, ContactMessageResponse,
  ServiceRequestBody, ServiceRequestResponse,
} from "../types/leads";
import type { ErrorResponse } from "../types/common";

@Route("v1/contact-messages")
@Tags("Contact")
export class ContactController extends Controller {
  /**
   * Submit a contact message. Used on the Contact Us, About, Locations, and Cleaning with Fada pages.
   */
  @Post("/")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitContactMessage(
    @Body() body: ContactMessageRequest
  ): Promise<ContactMessageResponse> {
    const rows = await db.query(
      `INSERT INTO contact_messages (email, message, source) VALUES ($1, $2, $3) RETURNING id, created_at`,
      [body.email, body.message, body.source ?? null]
    );
    this.setStatus(201);
    return rows[0] as ContactMessageResponse;
  }
}

@Route("v1/service-requests")
@Tags("Service Requests")
export class ServiceRequestsController extends Controller {
  /**
   * Submit a custom service request. Used on the Services page "Request Service" CTA.
   */
  @Post("/")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitServiceRequest(
    @Body() body: ServiceRequestBody
  ): Promise<ServiceRequestResponse> {
    const rows = await db.query(
      `INSERT INTO service_requests (name, email, phone, service_description, preferred_date, location)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [
        body.name, body.email, body.phone ?? null,
        body.service_description, body.preferred_date ?? null, body.location ?? null,
      ]
    );
    this.setStatus(201);
    return rows[0] as ServiceRequestResponse;
  }
}
