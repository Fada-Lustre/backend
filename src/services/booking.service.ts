import * as bookingRepo from "../repositories/booking.repository";
import * as reviewRepo from "../repositories/review.repository";
import * as txRepo from "../repositories/transaction.repository";
import * as addressRepo from "../repositories/address.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type {
  CreateBookingRequest, BookingListItem, BookingDetail,
  AmendBookingRequest, RescheduleBookingRequest, RateBookingRequest,
  BookingImageResponse, ReceiptResponse, PaymentMethod,
} from "../types/booking";

const CANCELLABLE_STATUSES = ["unassigned", "scheduled"];

export async function createBooking(userId: string, body: CreateBookingRequest): Promise<{ id: string; status: string; price: string | null }> {
  const addr = await addressRepo.findByIdAndUser(body.address_id, userId);
  if (!addr) {
    throw new ApplicationError(400, "Address not found or does not belong to you", "VALIDATION_ERROR");
  }

  const today = new Date().toISOString().slice(0, 10);
  if (body.date <= today) {
    throw new ApplicationError(400, "Booking date must be in the future", "VALIDATION_ERROR");
  }

  const booking = await bookingRepo.create({
    customer_id: userId, address_id: body.address_id, service_type: body.service_type,
    condition: body.condition, property_type: body.property_type,
    total_sq_metres: body.total_sq_metres, rooms: body.rooms, floors: body.floors ?? 1,
    bathrooms: body.bathrooms, add_ons: JSON.stringify(body.add_ons ?? []),
    scheduled_date: body.date, time_start: body.time,
    additional_info: body.additional_info, use_same_cleaner: body.use_same_cleaner,
    created_by: userId,
  });

  return { id: booking.id, status: booking.status, price: booking.total_price };
}

export async function listBookings(
  userId: string, statusFilter: string, page: number, limit: number
): Promise<{ data: BookingListItem[]; total: number }> {
  const result = await bookingRepo.listByCustomer(userId, statusFilter, page, limit);

  return {
    data: result.data.map(r => ({
      id: r.id, service_type: r.service_type, date: r.date, time: r.time, status: r.status,
      cleaner: r.cleaner_name ? { name: r.cleaner_name, rating: r.cleaner_rating ? parseFloat(r.cleaner_rating) : null } : null,
    })),
    total: result.total,
  };
}

export async function getBooking(userId: string, bookingId: string, role: string): Promise<BookingDetail> {
  const b = await bookingRepo.findDetailWithCleaner(bookingId);
  if (!b) {
    throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  }

  if (role !== "admin") {
    assertOwnership(b.customer_id as string, userId);
  }

  return {
    id: b.id as string, service_type: b.service_type as string, status: b.status as string,
    date: b.date as string, time: b.time as string, additional_info: b.additional_info as string | null,
    use_same_cleaner: b.use_same_cleaner as boolean,
    cleaner: b.cleaner_id ? {
      id: b.cleaner_id as string,
      name: b.cleaner_name as string,
      rating: b.cleaner_rating ? parseFloat(b.cleaner_rating as string) : null,
      completed_bookings: (b.cleaner_completed_bookings as number) ?? 0,
      location: (b.cleaner_location as string) || null,
    } : null,
    payment: {
      booking_fee: b.booking_fee as string | null, charges: b.charges as string | null,
      discount: b.discount as string | null, total: b.total_price as string | null,
      method: b.payment_method as string | null, status: b.payment_status as string,
    },
  };
}

export async function payBooking(
  userId: string, bookingId: string, method: PaymentMethod, tip: number
): Promise<{ transaction_id: string; client_secret?: string; status: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  if (booking.payment_status === "successful") {
    throw new ApplicationError(409, "Booking is already paid", "ALREADY_PAID");
  }

  const amount = parseFloat(booking.total_price ?? "0") + tip;
  const isCash = method === "cash";

  const tx = await txRepo.create({
    booking_id: bookingId, payer_id: userId, type: 'booking',
    amount, payment_method: method, status: isCash ? 'successful' : 'pending',
  });

  if (isCash) {
    await bookingRepo.updatePayment(bookingId, { payment_method: method, payment_status: 'successful', tip_amount: tip });
  } else {
    await bookingRepo.updatePayment(bookingId, { payment_method: method, tip_amount: tip });
  }

  return {
    transaction_id: tx.id,
    client_secret: isCash ? undefined : `pi_stub_${tx.id}_secret`,
    status: isCash ? "confirmed" : "pending",
  };
}

export async function amendBooking(
  userId: string, bookingId: string, body: AmendBookingRequest
): Promise<{ id: string; amendment_id: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  if (["done", "cancelled"].includes(booking.status)) {
    throw new ApplicationError(409, "Cannot amend a completed or cancelled booking", "STATE_CONFLICT");
  }

  const amendment = await bookingRepo.insertAmendment(bookingId, userId, {
    floors: body.floors ?? null, rooms: body.rooms ?? null, bathrooms: body.bathrooms ?? null,
    add_ons: body.add_ons ? JSON.stringify(body.add_ons) : null, additional_info: body.additional_info ?? null,
  });

  return { id: bookingId, amendment_id: amendment.id };
}

export async function rescheduleBooking(
  userId: string, bookingId: string, date: string, time: string
): Promise<{ id: string; new_date: string; new_time: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  if (["done", "cancelled"].includes(booking.status)) {
    throw new ApplicationError(409, "Cannot reschedule a completed or cancelled booking", "STATE_CONFLICT");
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date <= today) {
    throw new ApplicationError(400, "Date must be in the future", "VALIDATION_ERROR");
  }

  await bookingRepo.updateSchedule(bookingId, date, time);

  return { id: bookingId, new_date: date, new_time: time };
}

export async function cancelBooking(
  userId: string, bookingId: string
): Promise<{ id: string; status: string; refund_status: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  if (!CANCELLABLE_STATUSES.includes(booking.status)) {
    throw new ApplicationError(409, "Booking cannot be cancelled in its current state", "STATE_CONFLICT");
  }

  await bookingRepo.cancelBooking(bookingId, userId);

  const refundStatus = booking.payment_status === "successful" ? "pending" : "none";
  return { id: bookingId, status: "cancelled", refund_status: refundStatus };
}

export async function rebookBooking(
  userId: string, bookingId: string
): Promise<{ id: string; status: string; cloned_from: string }> {
  const existing = await bookingRepo.findById(bookingId);
  if (!existing) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(existing.customer_id, userId);

  if (!["done", "cancelled"].includes(existing.status)) {
    throw new ApplicationError(409, "Can only rebook a completed or cancelled booking", "STATE_CONFLICT");
  }

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const newBooking = await bookingRepo.create({
    customer_id: userId, address_id: existing.address_id, service_type: existing.service_type,
    condition: existing.condition, property_type: existing.property_type,
    total_sq_metres: existing.total_sq_metres, rooms: existing.rooms, floors: existing.floors,
    bathrooms: existing.bathrooms, add_ons: JSON.stringify(existing.add_ons ?? []),
    scheduled_date: tomorrow, time_start: existing.time_start,
    additional_info: existing.additional_info, use_same_cleaner: existing.use_same_cleaner,
    rebooked_from_id: bookingId, created_by: userId,
  });

  return { id: newBooking.id, status: newBooking.status, cloned_from: bookingId };
}

export async function rateBooking(
  userId: string, bookingId: string, rating: number, review?: string
): Promise<{ id: string; rating: number }> {
  if (rating < 1 || rating > 5) {
    throw new ApplicationError(400, "Rating must be between 1 and 5", "VALIDATION_ERROR");
  }

  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  if (booking.status !== "done") {
    throw new ApplicationError(409, "Can only rate a completed booking", "STATE_CONFLICT");
  }
  if (!booking.cleaner_id) {
    throw new ApplicationError(409, "No cleaner assigned to this booking", "STATE_CONFLICT");
  }

  let rows: { id: string }[];
  try {
    const result = await reviewRepo.create({
      booking_id: bookingId, reviewer_id: userId, reviewee_id: booking.cleaner_id!,
      rating, review_text: review
    });
    rows = [result];
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr.code === "23505") {
      throw new ApplicationError(409, "You have already rated this booking", "ALREADY_RATED");
    }
    throw err;
  }

  return { id: rows[0]!.id, rating };
}

export async function changeCleaner(
  userId: string, bookingId: string
): Promise<{ success: boolean; new_cleaner?: { id: string; name: string; rating: number | null }; message?: string }> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(booking.customer_id, userId);

  return { success: false, message: "No replacement available" };
}

export async function getImages(
  userId: string, bookingId: string, role: string
): Promise<BookingImageResponse[]> {
  const booking = await bookingRepo.findByIdBasic(bookingId);
  if (!booking) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");

  if (role === "customer") assertOwnership(booking.customer_id, userId);
  else if (role === "cleaner" && booking.cleaner_id) assertOwnership(booking.cleaner_id, userId);

  return await bookingRepo.listImagesByBooking(bookingId);
}

export async function getReceipt(userId: string, bookingId: string): Promise<ReceiptResponse> {
  const row = await bookingRepo.findReceiptById(bookingId);
  if (!row) throw new ApplicationError(404, "Booking not found", "NOT_FOUND");
  assertOwnership(row.customer_id, userId);

  const { customer_id: _, ...receipt } = row;
  return receipt;
}
