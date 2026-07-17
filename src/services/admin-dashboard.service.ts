import * as bookingRepo from "../repositories/booking.repository";
import * as userRepo from "../repositories/user.repository";
import * as txRepo from "../repositories/transaction.repository";
import { signUrl } from "../lib/r2";
import { clampPagination, validateIsoDateParam } from "../lib/validation";
import type {
  DashboardResponse,
  DashboardStatsResponse,
  DashboardUpcomingResponse,
  DashboardTransactionsResponse,
  TopRatedPerson,
} from "../types/admin-dashboard";

async function signTopPeople(people: { profile_image_url: string | null }[]): Promise<TopRatedPerson[]> {
  return Promise.all(
    people.map(async (p) => ({ ...(p as TopRatedPerson), profile_image_url: await signUrl(p.profile_image_url) }))
  );
}

/**
 * Normalize a transaction row to the API shape. `listAdmin` already returns
 * `date` (created_at::date::text) and `time` (to_char) columns, so prefer those;
 * fall back to created_at (which pg returns as a Date, not a string).
 */
function toTransactionItem(row: Record<string, unknown>): {
  id: string; ref: string; name: string; type: string; amount: number; date: string; time: string; status: string;
} {
  const createdAtStr =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : typeof row.created_at === "string"
        ? row.created_at
        : "";
  return {
    id: row.id as string,
    ref: (row.ref as string) ?? "",
    name: ((row.name as string) ?? "").trim(),
    type: row.type as string,
    amount: row.amount as number,
    date: (row.date as string) ?? createdAtStr.slice(0, 10),
    time: (row.time as string) ?? createdAtStr.slice(11, 16),
    status: row.status as string,
  };
}

export async function getDashboard(opts?: {
  period?: string;
  week_start?: string;
  week_end?: string;
  tx_page?: number;
  tx_limit?: number;
  tx_type?: string;
}): Promise<DashboardResponse> {
  const period = opts?.period;
  // Validate date params before they reach the Postgres date cast (avoids 500s).
  const weekStart = validateIsoDateParam(opts?.week_start, "week_start");
  const weekEnd = validateIsoDateParam(opts?.week_end, "week_end");
  // Clamp pagination to positive integers (negative OFFSET/LIMIT throws in Postgres).
  const { page: txPage, limit: txLimit } = clampPagination(
    Math.trunc(opts?.tx_page ?? 1),
    Math.trunc(opts?.tx_limit ?? 10)
  );
  const txType = opts?.tx_type;

  const { balance, pending } = await txRepo.balanceSummary(period);

  const totalBookings = await bookingRepo.countTotal(period);

  const topClients = await userRepo.topByRating('customer', 5, period);
  const topCleaners = await userRepo.topByRating('cleaner', 5, period);

  const [signedClients, signedCleaners] = await Promise.all([
    Promise.all(topClients.map(async (c) => ({
      ...c,
      profile_image_url: await signUrl(c.profile_image_url),
    }))),
    Promise.all(topCleaners.map(async (c) => ({
      ...c,
      profile_image_url: await signUrl(c.profile_image_url),
    }))),
  ]);

  const upcomingBookings = await bookingRepo.upcomingByService(weekStart, weekEnd);

  const countsMap = await bookingRepo.countByServiceType();

  const txResult = await txRepo.listAdmin(
    { period, type: txType },
    txPage,
    txLimit
  );

  const recentTransactions = {
    data: txResult.data.map(toTransactionItem),
    meta: { total: txResult.total, page: txPage, limit: txLimit },
  };

  return {
    balance,
    pending,
    total_bookings: totalBookings,
    top_clients: signedClients,
    top_cleaners: signedCleaners,
    upcoming_bookings: upcomingBookings,
    service_counts: countsMap,
    recent_transactions: recentTransactions,
  };
}

// ── Split endpoints (preferred; the combined getDashboard is retained for
//    backward compatibility) ──────────────────────────────────────────────

/**
 * Aggregate stats — balance, pending, total bookings, top clients/cleaners,
 * service counts. Filter by explicit date range (from/to) OR relative period.
 */
export async function getStats(opts?: {
  period?: string;
  from?: string;
  to?: string;
}): Promise<DashboardStatsResponse> {
  const period = opts?.period;
  const from = validateIsoDateParam(opts?.from, "from");
  const to = validateIsoDateParam(opts?.to, "to");

  const [{ balance, pending }, totalBookings, topClients, topCleaners, countsMap] = await Promise.all([
    txRepo.balanceSummary(period, from, to),
    bookingRepo.countTotal(period, from, to),
    userRepo.topByRating("customer", 5, period, from, to),
    userRepo.topByRating("cleaner", 5, period, from, to),
    bookingRepo.countByServiceType(),
  ]);

  const [signedClients, signedCleaners] = await Promise.all([
    signTopPeople(topClients),
    signTopPeople(topCleaners),
  ]);

  return {
    balance,
    pending,
    total_bookings: totalBookings,
    top_clients: signedClients,
    top_cleaners: signedCleaners,
    service_counts: countsMap,
  };
}

/**
 * Upcoming bookings grouped by service, filtered by scheduled_date range.
 */
export async function getUpcoming(opts?: {
  week_start?: string;
  week_end?: string;
}): Promise<DashboardUpcomingResponse> {
  const weekStart = validateIsoDateParam(opts?.week_start, "week_start");
  const weekEnd = validateIsoDateParam(opts?.week_end, "week_end");
  const upcomingBookings = await bookingRepo.upcomingByService(weekStart, weekEnd);
  return { upcoming_bookings: upcomingBookings };
}

/**
 * Paginated transactions, filterable by type (all/booking/payout) and date range.
 */
export async function getTransactions(opts?: {
  period?: string;
  from?: string;
  to?: string;
  tx_type?: string;
  tx_page?: number;
  tx_limit?: number;
}): Promise<DashboardTransactionsResponse> {
  const period = opts?.period;
  const from = validateIsoDateParam(opts?.from, "from");
  const to = validateIsoDateParam(opts?.to, "to");
  const { page: txPage, limit: txLimit } = clampPagination(
    Math.trunc(opts?.tx_page ?? 1),
    Math.trunc(opts?.tx_limit ?? 10)
  );

  const txResult = await txRepo.listAdmin({ period, from, to, type: opts?.tx_type }, txPage, txLimit);

  return {
    data: txResult.data.map(toTransactionItem),
    meta: { total: txResult.total, page: txPage, limit: txLimit },
  };
}
