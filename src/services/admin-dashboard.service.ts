import * as bookingRepo from "../repositories/booking.repository";
import * as userRepo from "../repositories/user.repository";
import * as txRepo from "../repositories/transaction.repository";
import type { DashboardResponse } from "../types/admin-dashboard";

export async function getDashboard(): Promise<DashboardResponse> {
  const { balance, pending } = await txRepo.balanceSummary();

  const totalBookings = await bookingRepo.countTotal();

  const topClients = await userRepo.topByRating('customer', 5);
  const topCleaners = await userRepo.topByRating('cleaner', 5);

  const upcomingBookings = await bookingRepo.upcomingByService();

  const countsMap = await bookingRepo.countByServiceType();

  const recentTransactions = await txRepo.listRecent(5);

  return {
    balance,
    pending,
    total_bookings: totalBookings,
    top_clients: topClients,
    top_cleaners: topCleaners,
    upcoming_bookings: upcomingBookings,
    service_counts: countsMap,
    recent_transactions: recentTransactions,
  };
}
