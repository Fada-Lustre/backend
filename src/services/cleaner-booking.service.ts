import * as bookingRepo from "../repositories/booking.repository";
import * as reviewRepo from "../repositories/review.repository";
import { ApplicationError } from "../errors";
import type { CleanerBookingListItem, CleanerBookingDetail } from "../types/cleaner-booking";

export async function listBookings(
  cleanerId: string, filter: string, page: number, limit: number
): Promise<{ data: CleanerBookingListItem[]; total: number }> {
  const result = await bookingRepo.listByCleaner(cleanerId, filter, page, limit);

  return {
    data: result.data.map(r => ({
      id: r.id, service_type: r.service_type, date: r.date, time: r.time, status: r.status,
      customer: r.customer_name ? { name: r.customer_name, rating: r.customer_rating ? parseFloat(r.customer_rating) : null } : null,
    })),
    total: result.total,
  };
}

export async function getBooking(cleanerId: string, bookingId: string): Promise<CleanerBookingDetail> {
  const b = await bookingRepo.findCleanerBookingDetail(bookingId);
  if (!b) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");

  if (b.cleaner_id !== cleanerId) {
    throw new ApplicationError(403, "You are not assigned to this booking", "FORBIDDEN");
  }

  return {
    id: b.id, service_type: b.service_type, status: b.status, date: b.date, time: b.time,
    additional_info: b.additional_info,
    customer: b.customer_id ? {
      id: b.customer_id,
      name: b.customer_name!,
      rating: b.customer_rating ? parseFloat(b.customer_rating) : null,
      completed_bookings: b.customer_completed_bookings ?? 0,
    } : null,
    address: b.street ? {
      label: b.label,
      street: b.street,
      floor_number: b.floor_number,
      door_number: b.door_number,
      county: b.county,
      entrance_notes: b.entrance_notes,
    } : null,
  };
}

export async function startBooking(cleanerId: string, bookingId: string): Promise<{ id: string; status: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  if (booking.cleaner_id !== cleanerId) throw new ApplicationError(403, "Not assigned to this booking", "FORBIDDEN");
  if (booking.status !== "scheduled") throw new ApplicationError(409, "Booking must be in scheduled state to start", "STATE_CONFLICT");

  await bookingRepo.updateStatus(bookingId, 'on_the_way');
  return { id: bookingId, status: "on_the_way" };
}

export async function finishBooking(cleanerId: string, bookingId: string): Promise<{ id: string; status: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  if (booking.cleaner_id !== cleanerId) throw new ApplicationError(403, "Not assigned to this booking", "FORBIDDEN");
  if (!["on_the_way", "ongoing"].includes(booking.status)) {
    throw new ApplicationError(409, "Booking must be on_the_way or ongoing to finish", "STATE_CONFLICT");
  }

  await bookingRepo.updateStatus(bookingId, 'done');
  return { id: bookingId, status: "done" };
}

export async function cancelBooking(cleanerId: string, bookingId: string): Promise<{ id: string; status: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  if (booking.cleaner_id !== cleanerId) throw new ApplicationError(403, "Not assigned to this booking", "FORBIDDEN");
  if (booking.status !== "scheduled") {
    throw new ApplicationError(409, "Can only cancel a scheduled booking", "STATE_CONFLICT");
  }

  await bookingRepo.cancelBooking(bookingId, cleanerId);
  return { id: bookingId, status: "cancelled" };
}

export async function rateCustomer(
  cleanerId: string, bookingId: string, rating: number, review?: string
): Promise<{ id: string; rating: number }> {
  if (rating < 1 || rating > 5) throw new ApplicationError(400, "Rating must be between 1 and 5", "VALIDATION_ERROR");

  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  if (booking.cleaner_id !== cleanerId) throw new ApplicationError(403, "Not assigned to this booking", "FORBIDDEN");
  if (booking.status !== "done") throw new ApplicationError(409, "Can only rate after booking is done", "STATE_CONFLICT");

  let rows: { id: string }[];
  try {
    const result = await reviewRepo.create({
      booking_id: bookingId, reviewer_id: cleanerId, reviewee_id: booking.customer_id,
      rating, review_text: review
    });
    rows = [result];
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") throw new ApplicationError(409, "You have already rated this booking", "ALREADY_RATED");
    throw err;
  }

  return { id: rows[0]!.id, rating };
}
