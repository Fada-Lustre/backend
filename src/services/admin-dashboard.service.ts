import * as bookingRepo from "../repositories/booking.repository";
import * as userRepo from "../repositories/user.repository";
import * as txRepo from "../repositories/transaction.repository";
import { signUrl } from "../lib/r2";
import type { DashboardResponse } from "../types/admin-dashboard";

export async function getDashboard(opts?: {
  period?: string;
  week_start?: string;
  week_end?: string;
  tx_page?: number;
  tx_limit?: number;
  tx_type?: string;
}): Promise<DashboardResponse> {
  const period = opts?.period;
  const weekStart = opts?.week_start;
  const weekEnd = opts?.week_end;
  const txPage = opts?.tx_page ?? 1;
  const txLimit = opts?.tx_limit ?? 10;
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
    data: txResult.data.map((row) => ({
      id: row.id as string,
      ref: (row.ref as string) ?? "",
      name: (row.name as string) ?? "",
      type: row.type as string,
      amount: row.amount as number,
      date: row.created_at ? (row.created_at as string).slice(0, 10) : "",
      time: row.created_at ? (row.created_at as string).slice(11, 16) : "",
      status: row.status as string,
    })),
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
