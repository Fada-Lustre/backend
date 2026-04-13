import { Body, Controller, Post, Route, Tags, Response, SuccessResponse } from "tsoa";
import db from "../db";
import type {
  ContactMessageRequest, ContactMessageResponse,
  ServiceRequestBody, ServiceRequestResponse,
  CleanerApplicationRequest, CleanerApplicationResponse,
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

@Route("v1/cleaner-applications")
@Tags("Cleaner Applications")
export class CleanerApplicationsController extends Controller {
  /**
   * Submit a cleaner application. All boolean confirmations must be true.
   */
  @Post("/")
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Validation error")
  public async submitApplication(
    @Body() body: CleanerApplicationRequest
  ): Promise<CleanerApplicationResponse> {
    const confirmations = [
      body.right_to_work_uk,
      body.has_uk_bank_account,
      body.understands_self_employed,
      body.no_criminal_record,
      body.accepts_terms,
    ];
    if (confirmations.some((v) => v !== true)) {
      this.setStatus(400);
      throw Object.assign(new Error("All confirmations must be accepted"), {
        status: 400,
        error: { code: "VALIDATION_ERROR", message: "All confirmations must be accepted" },
      });
    }

    const rows = await db.query(
      `INSERT INTO cleaner_applications (
        first_name, last_name, country_code, phone_number, email, gender,
        postcode, years_of_experience, experience_types, experience_description,
        hours_per_week, available_days, commitment_duration,
        right_to_work_uk, has_uk_bank_account, understands_self_employed,
        no_criminal_record, accepts_terms
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING id, created_at`,
      [
        body.first_name, body.last_name, body.country_code ?? "+44",
        body.phone_number, body.email, body.gender,
        body.postcode, body.years_of_experience,
        JSON.stringify(body.experience_types),
        body.experience_description ?? "",
        body.hours_per_week, JSON.stringify(body.available_days),
        body.commitment_duration,
        body.right_to_work_uk, body.has_uk_bank_account,
        body.understands_self_employed, body.no_criminal_record,
        body.accepts_terms,
      ]
    );

    this.setStatus(201);
    return rows[0] as CleanerApplicationResponse;
  }
}
