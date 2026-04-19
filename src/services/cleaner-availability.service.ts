import * as availRepo from "../repositories/cleaner-availability.repository";
import { ApplicationError } from "../errors";
import type { AvailabilityResponse, UpdateAvailabilityRequest } from "../types/cleaner-availability";

const VALID_MODES = ["every_day", "weekdays", "weekends", "custom"];

export async function getAvailability(cleanerId: string): Promise<AvailabilityResponse> {
  const row = await availRepo.findByCleanerId(cleanerId);

  if (!row) {
    const defaultSchedule = {
      monday: { accept: true, start: "09:00", end: "17:00" },
      tuesday: { accept: true, start: "09:00", end: "17:00" },
      wednesday: { accept: true, start: "09:00", end: "17:00" },
      thursday: { accept: true, start: "09:00", end: "17:00" },
      friday: { accept: true, start: "09:00", end: "17:00" },
      saturday: { accept: true, start: "09:00", end: "17:00" },
      sunday: { accept: true, start: "09:00", end: "17:00" },
    };
    return { mode: "every_day", schedule: defaultSchedule, accept_bookings: true };
  }

  return {
    mode: row.mode,
    schedule: row.schedule as AvailabilityResponse["schedule"],
    accept_bookings: row.accept_bookings,
  };
}

export async function updateAvailability(
  cleanerId: string, body: UpdateAvailabilityRequest
): Promise<AvailabilityResponse> {
  if (!VALID_MODES.includes(body.mode)) {
    throw new ApplicationError(400, "mode must be every_day, weekdays, weekends, or custom", "VALIDATION_ERROR");
  }

  await availRepo.upsert(cleanerId, body.mode, JSON.stringify(body.schedule), body.accept_bookings ?? true);

  return { mode: body.mode, schedule: body.schedule, accept_bookings: body.accept_bookings ?? true };
}
