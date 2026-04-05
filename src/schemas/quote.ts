import { z } from "zod";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

const VALID_HOURS = [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0] as const;

export const QuoteRequestSchema = z.object({
  postcode: z.string().regex(UK_POSTCODE_REGEX, "Invalid UK postcode"),
  rooms: z.number().int().min(1).max(20),
  bathrooms: z.number().int().min(0).max(10),
  add_ons: z
    .array(z.enum(["oven", "fridge", "windows", "chairs"]))
    .optional()
    .default([]),
  hours: z.number().refine(
    (val) => (VALID_HOURS as readonly number[]).includes(val),
    { message: "Hours must be one of: 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0" }
  ),
  cleaning_products: z.enum(["bring", "provide"]),
  frequency: z.enum(["one-off", "2-3-times-a-week", "every-week", "every-2-weeks"]),
  preferred_days: z
    .array(z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]))
    .optional()
    .default([]),
  email: z.string().email("Invalid email format"),
  newsletter_opt_in: z.boolean().optional().default(false),
});

export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00",
] as const;

export const QuoteScheduleSchema = z.object({
  preferred_date: z.string().refine(
    (val) => !isNaN(Date.parse(val)) && new Date(val) > new Date(),
    { message: "Must be a valid future date (YYYY-MM-DD)" }
  ),
  preferred_time: z.enum(TIME_SLOTS),
});

export type QuoteScheduleInput = z.infer<typeof QuoteScheduleSchema>;
