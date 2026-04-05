export type Gender = "male" | "female";
export type CleaningExperienceType = "domestic" | "hotel" | "end_of_tenancy" | "laundry";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface ContactMessageRequest {
  email: string;
  message: string;
  /** Which page or flow the message came from */
  source?: "about" | "locations" | "quote" | "cleaning_with_fada" | "cleaner_registration" | "other";
}

export interface ContactMessageResponse {
  id: string;
  created_at: string;
}

export interface ServiceRequestBody {
  name: string;
  email: string;
  phone?: string;
  service_description: string;
  preferred_date?: string;
  location?: string;
}

export interface ServiceRequestResponse {
  id: string;
  created_at: string;
}

export interface CleanerApplicationRequest {
  first_name: string;
  last_name: string;
  /** Country code prefix, e.g. +44 */
  country_code?: string;
  phone_number: string;
  email: string;
  gender: Gender;
  /** UK home postcode */
  postcode: string;
  years_of_experience: string;
  experience_types: CleaningExperienceType[];
  experience_description?: string;
  /** Desired hours of cleaning work per week */
  hours_per_week: number;
  available_days: DayOfWeek[];
  commitment_duration: string;
  /** Must be true — applicant confirms right to work in UK */
  right_to_work_uk: true;
  /** Must be true — applicant confirms they have a UK bank account */
  has_uk_bank_account: true;
  /** Must be true — applicant confirms they understand self-employment */
  understands_self_employed: true;
  /** Must be true — applicant confirms no criminal record */
  no_criminal_record: true;
  /** Must be true — applicant has read and accepted the Privacy Policy and Terms of Service */
  accepts_terms: true;
}

export interface CleanerApplicationResponse {
  id: string;
  created_at: string;
}
