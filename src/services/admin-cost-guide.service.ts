import * as contentRepo from "../repositories/content.repository";
import { ApplicationError } from "../errors";
import { logActivity } from "./activity-log.service";
import type { ContentBlock } from "../types/admin-cost-guide";

export async function listCostGuides(filters?: { status?: string; period?: string; search?: string }) {
  return contentRepo.listCostGuidesAdmin(filters);
}

export async function getCostGuide(guideId: string): Promise<Record<string, unknown>> {
  const guide = await contentRepo.getCostGuideAdmin(guideId);
  if (!guide) throw new ApplicationError(404, "Cost guide not found", "NOT_FOUND");
  return guide;
}

export async function createCostGuide(
  actorId: string,
  title: string,
  description: string,
  contentBlocks: ContentBlock[]
): Promise<{ id: string; title: string; status: string }> {
  if (!title || title.length > 500) {
    throw new ApplicationError(400, "Title must be 1-500 characters", "VALIDATION_ERROR");
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
  const result = await contentRepo.createCostGuide(title, slug, description, JSON.stringify(contentBlocks));
  await logActivity(actorId, `Created cost guide - ${title}`, "cost_guide", result.id);
  return result;
}

export async function updateCostGuide(
  actorId: string,
  guideId: string,
  updates: { title?: string; description?: string; content_blocks?: ContentBlock[] }
): Promise<Record<string, unknown>> {
  const fields: Record<string, string | number> = {};
  if (updates.title !== undefined) fields.title = updates.title;
  if (updates.description !== undefined) fields.excerpt = updates.description;
  if (updates.content_blocks !== undefined) fields.content_blocks = JSON.stringify(updates.content_blocks);
  if (Object.keys(fields).length === 0) throw new ApplicationError(400, "No fields to update", "VALIDATION_ERROR");
  const result = await contentRepo.updateCostGuide(guideId, fields);
  if (!result) throw new ApplicationError(404, "Cost guide not found", "NOT_FOUND");
  await logActivity(actorId, `Updated cost guide - ${result.title}`, "cost_guide", guideId);
  return result;
}

export async function archiveCostGuide(
  actorId: string,
  guideId: string
): Promise<{ id: string; status: string }> {
  const result = await contentRepo.archiveCostGuide(guideId);
  if (!result) throw new ApplicationError(404, "Cost guide not found or already archived", "NOT_FOUND");
  await logActivity(actorId, `Archived cost guide - ${result.title}`, "cost_guide", guideId);
  return { id: guideId, status: "archived" };
}

export async function unarchiveCostGuide(
  actorId: string,
  guideId: string
): Promise<{ id: string; status: string }> {
  const result = await contentRepo.unarchiveCostGuide(guideId);
  if (!result) throw new ApplicationError(404, "Cost guide not found or not archived", "NOT_FOUND");
  await logActivity(actorId, `Unarchived cost guide - ${result.title}`, "cost_guide", guideId);
  return { id: guideId, status: "active" };
}
