import { z } from "zod";

export const ContactMessageSchema = z.object({
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required").max(2000),
  source: z
    .enum([
      "about",
      "locations",
      "quote",
      "cleaning_with_fada",
      "cleaner_registration",
      "other",
    ])
    .optional(),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
