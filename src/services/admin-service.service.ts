import * as contentRepo from "../repositories/content.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";

export async function listServices() {
  return contentRepo.listServicesAdmin();
}

export async function getService(serviceId: string): Promise<Record<string, unknown>> {
  const service = await contentRepo.getServiceAdmin(serviceId);
  if (!service) throw new ApplicationError(404, "Service not found", "NOT_FOUND");
  return service;
}

export async function createService(
  actorId: string,
  name: string,
  description: string,
  imageUrl: string | null
): Promise<{ id: string; name: string; status: string }> {
  if (!name || name.length > 200) {
    throw new ApplicationError(400, "Name must be 1-200 characters", "VALIDATION_ERROR");
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
  const result = await contentRepo.createService(name, slug, description, imageUrl);
  await logActivity(actorId, `Added new service - ${name}`, "service", result.id);
  return result;
}

export async function updateService(
  actorId: string,
  serviceId: string,
  updates: { name?: string; description?: string; imageUrl?: string }
): Promise<Record<string, unknown>> {
  const fields: Record<string, string | number> = {};
  if (updates.name !== undefined) fields.title = updates.name;
  if (updates.description !== undefined) fields.description = updates.description;
  if (updates.imageUrl !== undefined) fields.image_url = updates.imageUrl;
  if (Object.keys(fields).length === 0) throw new ApplicationError(400, "No fields to update", "VALIDATION_ERROR");
  const result = await contentRepo.updateService(serviceId, fields);
  if (!result) throw new ApplicationError(404, "Service not found", "NOT_FOUND");
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
