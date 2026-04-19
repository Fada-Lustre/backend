import * as leadsRepo from "../repositories/leads.repository";
import { ApplicationError } from "../errors";
import type {
  ContactMessageRequest, ContactMessageResponse,
  ServiceRequestBody, ServiceRequestResponse,
  CleanerApplicationRequest, CleanerApplicationResponse,
  CleanerApplicationDetail, UpdateCleanerApplicationRequest,
} from "../types/leads";

export async function submitContactMessage(body: ContactMessageRequest): Promise<ContactMessageResponse> {
  const row = await leadsRepo.insertContactMessage(body.email, body.message, body.source ?? null);
  return row as unknown as ContactMessageResponse;
}

export async function submitServiceRequest(body: ServiceRequestBody): Promise<ServiceRequestResponse> {
  const row = await leadsRepo.insertServiceRequest(body.name, body.email, body.phone ?? null, body.service_description, body.preferred_date ?? null, body.location ?? null);
  return row as unknown as ServiceRequestResponse;
}

export async function submitCleanerApplication(body: CleanerApplicationRequest): Promise<CleanerApplicationResponse> {
  const confirmations = [
    body.right_to_work_uk,
    body.has_uk_bank_account,
    body.understands_self_employed,
    body.no_criminal_record,
    body.accepts_terms,
  ];
  if (confirmations.some((v) => v !== true)) {
    throw new ApplicationError(400, "All confirmations must be accepted", "VALIDATION_ERROR");
  }

  const row = await leadsRepo.insertCleanerApplication([
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
  ]);

  return row as unknown as CleanerApplicationResponse;
}

export async function getCleanerApplication(applicationId: string): Promise<CleanerApplicationDetail> {
  const row = await leadsRepo.findCleanerApplication(applicationId);

  if (!row) {
    throw new ApplicationError(404, "Application not found", "NOT_FOUND");
  }

  return row as unknown as CleanerApplicationDetail;
}

export async function updateCleanerApplication(
  applicationId: string, body: UpdateCleanerApplicationRequest
): Promise<CleanerApplicationDetail> {
  const app = await leadsRepo.findCleanerApplicationStatus(applicationId);

  if (!app) {
    throw new ApplicationError(404, "Application not found", "NOT_FOUND");
  }

  if (app.status !== "draft") {
    throw new ApplicationError(409, "Only draft applications can be edited", "STATE_CONFLICT");
  }

  const fields: Record<string, string | number> = {};
  if (body.first_name !== undefined) fields.first_name = body.first_name;
  if (body.last_name !== undefined) fields.last_name = body.last_name;
  if (body.phone_number !== undefined) fields.phone_number = body.phone_number;
  if (body.postcode !== undefined) fields.postcode = body.postcode;
  if (body.experience_description !== undefined) fields.experience_description = body.experience_description;
  if (body.hours_per_week !== undefined) fields.hours_per_week = body.hours_per_week;

  if (Object.keys(fields).length === 0) {
    return getCleanerApplication(applicationId);
  }

  const result = await leadsRepo.updateCleanerApplication(applicationId, fields);
  return result as unknown as CleanerApplicationDetail;
}
