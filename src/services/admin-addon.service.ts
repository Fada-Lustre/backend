import * as quoteRepo from "../repositories/quote.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { signUrl } from "../lib/r2";
import type { AddOnRow } from "../types/rows";
import type { AddOnSlug } from "../types/quotes";
import type { AdminAddOn } from "../types/admin-addon";
import type { ListResponse } from "../types/common";

async function toSignedAddOn(row: AddOnRow): Promise<AdminAddOn> {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug as AddOnSlug,
    hours_added: parseFloat(row.hours_added),
    active: row.active ?? true,
    image_url: await signUrl(row.image_url),
  };
}

export async function listAddOns(): Promise<ListResponse<AdminAddOn>> {
  const rows = await quoteRepo.listAllAddOns();
  const data = await Promise.all(rows.map(toSignedAddOn));
  return { data, meta: { total: rows.length, page: 1, limit: rows.length } };
}

export async function findAddOn(id: string): Promise<AddOnRow | null> {
  return quoteRepo.findAddOnById(id);
}

export async function setAddOnImage(actorId: string, id: string, imageKey: string): Promise<AdminAddOn> {
  const updated = await quoteRepo.updateAddOnImage(id, imageKey);
  if (!updated) throw new ApplicationError(404, "Add-on not found", "NOT_FOUND");
  await logActivity(actorId, `Updated add-on image - ${updated.name}`, "add_on", id);
  return toSignedAddOn(updated);
}
