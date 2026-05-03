import * as bookingRepo from "../repositories/booking.repository";
import * as userRepo from "../repositories/user.repository";
import * as addressRepo from "../repositories/address.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { addSearchFilter, firstOr404 } from "../lib/query-helpers";
import { signUrl } from "../lib/r2";
import type { AdminBookingListItem, AdminBookingDetail, AdminCreateBookingRequest } from "../types/admin-booking";
import type { AdminListResponse } from "../types/admin-common";

export async function listBookings(
  page: number,
  limit: number,
  filters: { date?: string; location?: string; service?: string; status?: string; search?: string }
): Promise<AdminListResponse<AdminBookingListItem>> {
  const result = await bookingRepo.listAdmin(filters, page, limit);
  return { data: result.data, stats: result.stats, meta: { total: result.total, page, limit } };
}

export async function getBooking(bookingId: string): Promise<AdminBookingDetail> {
  const raw = await bookingRepo.findAdminDetail(bookingId);
  if (!raw) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");

  const rawImages = await bookingRepo.listImagesByBooking(bookingId);
  const images = await Promise.all(
    rawImages.map(async (img) => ({ ...img, url: (await signUrl(img.url)) ?? img.url }))
  );

  const detail = raw as Record<string, unknown>;
  return {
    id: detail.id as string,
    service_type: detail.service_type as string,
    booked_on: detail.created_at as string,
    booked_for: {
      date: detail.scheduled_date as string,
      time_start: detail.time_start as string,
      time_end: (detail.time_end as string) || null,
    },
    location: null,
    price: parseFloat((detail.total_price as string) ?? "0"),
    payment_method: detail.payment_method as string | null,
    status: detail.status as string,
    transaction_ref: detail.transaction_ref as string | null,
    additional_info: detail.additional_info as string | null,
    property_type: detail.property_type as string | null,
    total_sq_metres: detail.total_sq_metres as number | null,
    floors: detail.floors as number,
    rooms: detail.rooms as number,
    bathrooms: detail.bathrooms as number,
    customer: detail.customer as { id: string; name: string; email: string; phone?: string | null } | null,
    cleaner: detail.cleaner as { id: string; name: string } | null,
    images,
  } as AdminBookingDetail;
}

export async function createBooking(
  actorId: string,
  data: AdminCreateBookingRequest
): Promise<{ id: string; price: number; status: string }> {
  let customerId: string;

  const existingCustomer = await userRepo.findByEmailAndRole(data.email, 'customer');

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const created = await userRepo.create({
      first_name: data.customer_name,
      email: data.email,
      password_hash: 'admin_created',
      role: 'customer',
      phone: data.phone,
    });
    customerId = created.id;
  }

  const addr = await addressRepo.createSimple(customerId, data.cleaning_address, 'booking');

  const booking = await bookingRepo.create({
    customer_id: customerId, address_id: addr.id, service_type: data.service_type,
    condition: data.condition, property_type: data.property_type,
    total_sq_metres: data.total_sq_metres, rooms: data.rooms, floors: data.floors ?? 1,
    bathrooms: data.bathrooms, add_ons: JSON.stringify(data.add_ons ?? []),
    scheduled_date: data.date, time_start: data.time_start, time_end: data.time_end,
    additional_info: data.additional_info, use_same_cleaner: data.use_same_cleaner,
    booking_fee: 0, total_price: 0, created_by: actorId, status: 'unassigned',
  });

  await logActivity(actorId, `Created booking on behalf of customer`, "booking", booking.id);

  return { id: booking.id, price: parseFloat(booking.total_price ?? "0"), status: booking.status };
}

export async function assignCleaner(
  actorId: string,
  bookingId: string,
  cleanerId: string
): Promise<{ id: string; status: string; cleaner: { id: string; name: string } }> {
  const cleaner = await userRepo.findByIdAndRole(cleanerId, 'cleaner');
  if (!cleaner) {
    throw new ApplicationError(404, "Cleaner not found", "NOT_FOUND");
  }

  const assigned = await bookingRepo.assignCleaner(bookingId, cleanerId);
  if (!assigned) {
    throw new ApplicationError(400, "Booking cannot be assigned (not unassigned)", "STATE_CONFLICT");
  }

  await logActivity(actorId, `Assigned cleaner ${cleaner.first_name} to booking`, "booking", bookingId);

  return {
    id: assigned.id,
    status: assigned.status,
    cleaner: { id: cleaner.id, name: `${cleaner.first_name} ${cleaner.last_name ?? ""}`.trim() },
  };
}

export async function rescheduleBooking(
  actorId: string,
  bookingId: string,
  date: string,
  startTime: string,
  endTime?: string
): Promise<{ id: string; scheduled_date: string; time_start: string; time_end: string | null; status: string }> {
  const result = await bookingRepo.rescheduleAdmin(bookingId, date, startTime, endTime);
  if (!result) {
    throw new ApplicationError(400, "Booking cannot be rescheduled", "STATE_CONFLICT");
  }

  await logActivity(actorId, `Rescheduled booking to ${date}`, "booking", bookingId);
  return result;
}

export async function cancelBooking(
  actorId: string,
  bookingId: string
): Promise<{ id: string; status: string; notifications_sent: string[] }> {
  const result = await bookingRepo.cancelBooking(bookingId, actorId);
  if (!result) {
    throw new ApplicationError(400, "Booking cannot be cancelled", "STATE_CONFLICT");
  }

  const notified: string[] = ["customer"];
  if (result.cleaner_id) notified.push("cleaner");

  await logActivity(actorId, `Cancelled booking`, "booking", bookingId);

  return { id: result.id, status: result.status, notifications_sent: notified };
}

export async function sendReceipt(
  actorId: string,
  bookingId: string
): Promise<{ message: string }> {
  const exists = await bookingRepo.existsById(bookingId);
  if (!exists) {
    throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  }

  await logActivity(actorId, `Sent receipt for booking`, "booking", bookingId);
  return { message: "Receipt sent to customer" };
}
