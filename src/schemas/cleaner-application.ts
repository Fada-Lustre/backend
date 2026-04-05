import { z } from "zod";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export const CleanerApplicationSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  country_code: z.string().min(1).max(5).default("+44"),
  phone_number: z.string().regex(/^\d{7,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email format"),
  gender: z.enum(["male", "female"]),
  postcode: z.string().regex(UK_POSTCODE_REGEX, "Invalid UK postcode"),
  years_of_experience: z.string().min(1),
  experience_types: z
    .array(z.enum(["domestic", "hotel", "end_of_tenancy", "laundry"]))
    .min(1, "Select at least one experience type"),
  experience_description: z.string().max(5000).optional().default(""),
  hours_per_week: z.coerce.number().int().min(1).max(60),
  available_days: z
    .array(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
    )
    .min(1, "Select at least one day"),
  commitment_duration: z.string().min(1),
  right_to_work_uk: z.literal(true, {
    errorMap: () => ({ message: "Must confirm right to work in the UK" }),
  }),
  has_uk_bank_account: z.literal(true, {
    errorMap: () => ({ message: "Must confirm UK bank account" }),
  }),
  understands_self_employed: z.literal(true, {
    errorMap: () => ({ message: "Must confirm self-employed understanding" }),
  }),
  no_criminal_record: z.literal(true, {
    errorMap: () => ({ message: "Must confirm no criminal record" }),
  }),
  accepts_terms: z.literal(true, {
    errorMap: () => ({ message: "Must accept terms and privacy policy" }),
  }),
});

export type CleanerApplicationInput = z.infer<typeof CleanerApplicationSchema>;
