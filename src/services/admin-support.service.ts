import * as supportRepo from "../repositories/support.repository";
import * as userRepo from "../repositories/user.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { firstOr404 } from "../lib/query-helpers";

export async function listTickets(
  page: number,
  limit: number,
  filters: { status?: string; search?: string }
): Promise<{ data: Record<string, unknown>[]; stats: Record<string, unknown>; meta: { total: number; page: number; limit: number } }> {
  const result = await supportRepo.listTicketsAdmin(filters, page, limit);
  return { data: result.data, stats: result.stats, meta: { total: result.total, page, limit } };
}

export async function getTicket(ticketId: string): Promise<Record<string, unknown>> {
  const ticket = await supportRepo.getTicketAdmin(ticketId);
  const t = firstOr404(ticket ? [ticket] : [], "Ticket not found");

  const messages = await supportRepo.listMessagesAdmin(ticketId);
  return { ...t, messages };
}

export async function addMessage(
  actorId: string,
  ticketId: string,
  body: string
): Promise<{ id: string; body: string; created_at: string }> {
  if (!body || body.length > 5000) {
    throw new ApplicationError(400, "Message body must be 1-5000 characters", "VALIDATION_ERROR");
  }

  const exists = await supportRepo.existsTicketById(ticketId);
  if (!exists) {
    throw new ApplicationError(404, "Ticket not found", "NOT_FOUND");
  }

  const msg = await supportRepo.createMessage(ticketId, actorId, body);
  await supportRepo.updateTicketLastMessage(ticketId);

  return msg;
}

export async function updateTicket(
  actorId: string,
  ticketId: string,
  updates: { status?: string; assigned_to?: string }
): Promise<Record<string, unknown>> {
  const sets: Record<string, string> = {};

  if (updates.status !== undefined) {
    sets.status = updates.status;
  }
  if (updates.assigned_to !== undefined) {
    sets.assigned_to = updates.assigned_to;
  }

  if (Object.keys(sets).length === 0) {
    throw new ApplicationError(400, "No fields to update", "VALIDATION_ERROR");
  }

  const result = await supportRepo.updateTicket(ticketId, sets);
  if (!result) {
    throw new ApplicationError(404, "Ticket not found", "NOT_FOUND");
  }

  if (updates.assigned_to) {
    const assignedUser = await userRepo.findNameById(updates.assigned_to);
    if (assignedUser) {
      (result as Record<string, unknown>).assigned_to = {
        id: assignedUser.id,
        name: `${assignedUser.first_name} ${assignedUser.last_name ?? ""}`.trim(),
      };
    }
  }

  await logActivity(actorId, `Updated support ticket`, "support_ticket", ticketId);

  return result;
}
