import * as contentRepo from "../repositories/content.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import { signUrl } from "../lib/r2";

async function signServiceImages(row: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (row.image_url) row.image_url = await signUrl(row.image_url as string);
  if (row.icon_url) row.icon_url = await signUrl(row.icon_url as string);
  return row;
}

export async function listServices(filters?: { status?: string; period?: string; location?: string; search?: string }) {
  const result = await contentRepo.listServicesAdmin(filters);
  result.data = await Promise.all(result.data.map(signServiceImages));
  return result;
}

export async function getService(serviceId: string): Promise<Record<string, unknown>> {
  const service = await contentRepo.getServiceAdmin(serviceId);
  if (!service) throw new ApplicationError(404, "Service not found", "NOT_FOUND");
  return signServiceImages(service);
}

export async function createService(
  actorId: string,
  name: string,
  description: string,
  imageUrl: string | null,
  iconUrl?: string | null
): Promise<{ id: string; name: string; status: string }> {
  if (!name || name.length > 200) {
    throw new ApplicationError(400, "Name must be 1-200 characters", "VALIDATION_ERROR");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
  const result = await contentRepo.createService(name, slug, description, imageUrl, iconUrl ?? null);
  await logActivity(actorId, `Added new service - ${name}`, "service", result.id);
  return result;
}

export async function updateService(
  actorId: string,
  serviceId: string,
  updates: { name?: string; description?: string; imageUrl?: string; iconUrl?: string }
): Promise<Record<string, unknown>> {
  const fields: Record<string, string | number> = {};
  if (updates.name !== undefined) fields.title = updates.name;
  if (updates.description !== undefined) fields.description = updates.description;
  if (updates.imageUrl !== undefined) fields.image_url = updates.imageUrl;
  if (updates.iconUrl !== undefined) fields.icon_url = updates.iconUrl;
  if (Object.keys(fields).length === 0) throw new ApplicationError(400, "No fields to update", "VALIDATION_ERROR");
  const result = await contentRepo.updateService(serviceId, fields);
  if (!result) throw new ApplicationError(404, "Service not found", "NOT_FOUND");
  await signServiceImages(result);
  await logActivity(actorId, `Updated service - ${result.name}`, "service", serviceId);
  return result;
}

export async function archiveService(
  actorId: string,
  serviceId: string
): Promise<{ id: string; status: string }> {
  const result = await contentRepo.archiveService(serviceId);
  if (!result) throw new ApplicationError(404, "Service not found or already archived", "NOT_FOUND");
  await logActivity(actorId, `Archived service - ${result.title}`, "service", serviceId);
  return { id: serviceId, status: "archived" };
}

export async function unarchiveService(
  actorId: string,
  serviceId: string
): Promise<{ id: string; status: string }> {
  const result = await contentRepo.unarchiveService(serviceId);
  if (!result) throw new ApplicationError(404, "Service not found or not archived", "NOT_FOUND");
  await logActivity(actorId, `Unarchived service - ${result.title}`, "service", serviceId);
  return { id: serviceId, status: "active" };
}
