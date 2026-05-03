import * as contentRepo from "../repositories/content.repository";
import { ApplicationError } from "../errors";
import { signUrl } from "../lib/r2";
import type { Service, BlogCategory, BlogPost, Faq, CostGuide, CostGuideDetail, Location } from "../types/content";
import type { ListResponse } from "../types/common";

async function signServiceRow(row: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (row.image_url) row.image_url = await signUrl(row.image_url as string);
  if (row.icon_url) row.icon_url = await signUrl(row.icon_url as string);
  return row;
}

async function signBlogRow(row: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (row.cover_image_url) row.cover_image_url = await signUrl(row.cover_image_url as string);
  return row;
}

export async function listServices(search?: string): Promise<ListResponse<Service>> {
  const rows = await contentRepo.listServices(search);
  const signed = await Promise.all((rows as unknown as Record<string, unknown>[]).map(signServiceRow));
  return { data: signed as unknown as Service[], meta: { total: rows.length, page: 1, limit: rows.length } };
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const row = await contentRepo.getServiceBySlug(slug);
  if (!row) throw new ApplicationError(404, "Service not found", "NOT_FOUND");
  await signServiceRow(row as unknown as Record<string, unknown>);
  return row as unknown as Service;
}

export async function listCategories(): Promise<ListResponse<BlogCategory>> {
  const rows = await contentRepo.listCategories();
  return { data: rows as unknown as BlogCategory[], meta: { total: rows.length, page: 1, limit: rows.length } };
}

export async function listPosts(
  category?: string, search?: string, page = 1, limit = 12
): Promise<ListResponse<BlogPost>> {
  const result = await contentRepo.listPosts(category, search, page, limit);
  const signed = await Promise.all((result.data as unknown as Record<string, unknown>[]).map(signBlogRow));
  return { data: signed as unknown as BlogPost[], meta: { total: result.total, page, limit: Math.min(limit, 50) } };
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const row = await contentRepo.getPostBySlug(slug);
  if (!row) throw new ApplicationError(404, "Post not found", "NOT_FOUND");
  await signBlogRow(row as unknown as Record<string, unknown>);
  return row as unknown as BlogPost;
}

export async function listFaqs(search?: string): Promise<ListResponse<Faq>> {
  const rows = await contentRepo.listFaqs(search);
  return { data: rows as unknown as Faq[], meta: { total: rows.length, page: 1, limit: rows.length } };
}

export async function listCostGuides(): Promise<ListResponse<CostGuide>> {
  const rows = await contentRepo.listCostGuides();
  return { data: rows as unknown as CostGuide[], meta: { total: rows.length, page: 1, limit: rows.length } };
}

export async function getCostGuideBySlug(slug: string): Promise<CostGuideDetail> {
  const guide = await contentRepo.getCostGuideBySlug(slug);
  if (!guide) throw new ApplicationError(404, "Cost guide not found", "NOT_FOUND");
  const pricing = await contentRepo.listCostGuidePricing(guide.id);
  return { ...guide, pricing_table: pricing } as unknown as CostGuideDetail;
}

export async function listLocations(): Promise<ListResponse<Location>> {
  const rows = await contentRepo.listLocations();
  return { data: rows as unknown as Location[], meta: { total: rows.length, page: 1, limit: rows.length } };
}
