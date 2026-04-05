import { z } from "zod";

export const ServiceRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(5000),
});

export type ServiceRequestInput = z.infer<typeof ServiceRequestSchema>;
