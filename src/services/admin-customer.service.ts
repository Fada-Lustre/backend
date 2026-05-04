import * as userRepo from "../repositories/user.repository";
import * as reviewRepo from "../repositories/review.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { firstOr404 } from "../lib/query-helpers";
import { blockUserByRole } from "./user-actions.service";

export async function listCustomers(
  page: number,
  limit: number,
  filters: { status?: string; location?: string; service?: string; search?: string; period?: string }
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; meta: { total: number; page: number; limit: number } }> {
  const result = await userRepo.listCustomersAdmin(filters, page, limit);
  return { data: result.data as unknown as Record<string, unknown>[], stats: result.stats, meta: { total: result.total, page, limit } };
}

export async function getCustomer(customerId: string): Promise<Record<string, unknown>> {
  const customer = await userRepo.getCustomerAdmin(customerId);
  firstOr404(customer ? [customer] : [], "Customer not found");

  const reviews = await reviewRepo.listByReviewee(customerId);
  const serviceTypes = await userRepo.getCustomerServiceTypes(customerId);
  const frequency = await userRepo.getCustomerBookingFrequency(customerId);
  const lastPaymentMethod = await userRepo.getCustomerLastPaymentMethod(customerId);

  return {
    ...customer!,
    reviews,
    services_booked: serviceTypes,
    frequency,
    last_payment_method: lastPaymentMethod,
  };
}

export async function blockCustomer(
  actorId: string,
  customerId: string
): Promise<{ id: string; status: string }> {
  return blockUserByRole(actorId, customerId, "customer");
}
