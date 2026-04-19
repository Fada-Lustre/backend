import * as supportRepo from "../repositories/support.repository";
import { ApplicationError } from "../errors";
import { assertOwnership } from "../middleware/ownership";
import type { CreateTicketRequest, TicketListItem, TicketDetail } from "../types/support";
import type { ListResponse } from "../types/common";

export async function createTicket(
  userId: string, body: CreateTicketRequest
): Promise<{ id: string; status: string; created_at: string }> {
  return supportRepo.createTicket(userId, body.title, body.message);
}

export async function listTickets(
  userId: string, statusFilter = "all", page = 1, limit = 20
): Promise<ListResponse<TicketListItem>> {
  const pageSize = Math.min(limit, 50);
  const result = await supportRepo.listTicketsByUser(userId, statusFilter, page, pageSize);
  return {
    data: result.data as unknown as TicketListItem[],
    meta: { total: result.total, page, limit: pageSize },
  };
}

export async function getTicket(userId: string, ticketId: string): Promise<TicketDetail> {
  const ticket = await supportRepo.findTicketById(ticketId);
  if (!ticket) {
    throw new ApplicationError(404, "Ticket not found", "NOT_FOUND");
  }
  assertOwnership(ticket.user_id, userId);

  const messageRows = await supportRepo.listMessagesByTicket(ticketId);

  const messages = messageRows.map((m: { id: string; sender_id: string; is_bot: boolean; body: string; created_at: string }) => ({
    id: m.id,
    sender: m.sender_id === userId ? "customer" : m.is_bot ? "bot" : "admin",
    body: m.body,
    created_at: m.created_at,
  }));

  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    created_at: ticket.created_at,
    messages,
  };
}
