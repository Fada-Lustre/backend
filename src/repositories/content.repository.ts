import db from "../db";
import type { ServiceRow, BlogCategoryRow, BlogPostRow, FaqRow, CostGuideRow, CostGuidePricingRow, LocationRow, CountRow } from "../types/rows";

const SERVICE_COLUMNS = "id, title, slug, description, image_url, icon_url, display_order";

// ── Services ───────────────────────────────────────────────────────────

export async function listServices(search?: string): Promise<ServiceRow[]> {
  const where = search ? "deleted_at IS NULL AND title ILIKE $1" : "deleted_at IS NULL";
  const params = search ? [`%${search}%`] : [];
  return await db.query(
    `SELECT ${SERVICE_COLUMNS} FROM services WHERE ${where} ORDER BY display_order ASC`, params
  ) as ServiceRow[];
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const rows = await db.query(
    `SELECT ${SERVICE_COLUMNS} FROM services WHERE slug = $1 AND deleted_at IS NULL`, [slug]
  ) as ServiceRow[];
  return rows[0] ?? null;
}

// ── Blog ───────────────────────────────────────────────────────────────

export async function listCategories(): Promise<BlogCategoryRow[]> {
  return await db.query(
    `SELECT id, name, slug FROM blog_categories WHERE deleted_at IS NULL ORDER BY name ASC`
  ) as BlogCategoryRow[];
}

export async function listPosts(
  category?: string,
  search?: string,
  page = 1,
  limit = 12
): Promise<{ data: BlogPostRow[]; total: number }> {
  const pageSize = Math.min(limit, 50);
  const offset = (page - 1) * pageSize;

  const conditions: string[] = ["p.deleted_at IS NULL", "p.published_at IS NOT NULL"];
  const params: (string | number)[] = [];

  if (category) { params.push(category); conditions.push(`c.slug = $${params.length}`); }
  if (search) { params.push(`%${search}%`); conditions.push(`(p.title ILIKE $${params.length} OR p.excerpt ILIKE $${params.length})`); }

  const where = conditions.join(" AND ");
  params.push(pageSize, offset);

  const rows = await db.query(
    `SELECT p.id, p.created_at, p.title, p.slug, p.excerpt, p.cover_image_url, p.author, p.published_at,
            c.name AS category_name, c.slug AS category_slug
     FROM blog_posts p LEFT JOIN blog_categories c ON p.category_id = c.id
     WHERE ${where} ORDER BY p.published_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params as string[]
  ) as BlogPostRow[];

  const countRows = await db.query(
    `SELECT COUNT(*) FROM blog_posts p LEFT JOIN blog_categories c ON p.category_id = c.id WHERE ${where}`,
    params.slice(0, -2) as string[]
  ) as CountRow[];

  return { data: rows, total: parseInt(countRows[0]!.count, 10) };
}

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const rows = await db.query(
    `SELECT p.id, p.created_at, p.title, p.slug, p.excerpt, p.content, p.cover_image_url, p.author, p.published_at,
            c.name AS category_name, c.slug AS category_slug
     FROM blog_posts p LEFT JOIN blog_categories c ON p.category_id = c.id
     WHERE p.slug = $1 AND p.deleted_at IS NULL`,
    [slug]
  ) as BlogPostRow[];
  return rows[0] ?? null;
}

// ── FAQs ───────────────────────────────────────────────────────────────

export async function listFaqs(search?: string): Promise<FaqRow[]> {
  const where = search ? "deleted_at IS NULL AND question ILIKE $1" : "deleted_at IS NULL";
  const params = search ? [`%${search}%`] : [];
  return await db.query(
    `SELECT id, question, answer, display_order FROM faqs WHERE ${where} ORDER BY display_order ASC`, params
  ) as FaqRow[];
}

// ── Cost Guides ────────────────────────────────────────────────────────

export async function listCostGuides(): Promise<CostGuideRow[]> {
  return await db.query(
    `SELECT id, title, slug, excerpt, published_at FROM cost_guides WHERE deleted_at IS NULL ORDER BY published_at DESC`
  ) as CostGuideRow[];
}

export async function getCostGuideBySlug(slug: string): Promise<CostGuideRow | null> {
  const rows = await db.query(
    `SELECT id, title, slug, excerpt, content, published_at FROM cost_guides WHERE slug = $1 AND deleted_at IS NULL`, [slug]
  ) as CostGuideRow[];
  return rows[0] ?? null;
}

export async function listCostGuidePricing(guideId: string): Promise<CostGuidePricingRow[]> {
  return await db.query(
    `SELECT id, service_category, rate, explanation, display_order FROM cost_guide_pricing WHERE cost_guide_id = $1 ORDER BY display_order ASC`,
    [guideId]
  ) as CostGuidePricingRow[];
}

// ── Locations ──────────────────────────────────────────────────────────

export async function listLocations(): Promise<LocationRow[]> {
  return await db.query(
    `SELECT id, name, region, country, status FROM locations WHERE status = 'active' ORDER BY name ASC`
  ) as LocationRow[];
}

// ── Admin Services CRUD ────────────────────────────────────────────────

export async function listServicesAdmin(
  filters?: { status?: string; period?: string; location?: string; search?: string }
): Promise<{ data: Record<string, unknown>[]; stats: { total: number; active: number; archived: number } }> {
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  if (filters?.status) {
    params.push(filters.status);
    conditions.push(`s.status = $${params.length}`);
  }
  if (filters?.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`s.title ILIKE $${params.length}`);
  }
  if (filters?.period) {
    const intervals: Record<string, string> = {
      today: "0 days", this_month: "1 month",
      past_3_months: "3 months", past_6_months: "6 months", past_year: "1 year",
    };
    const interval = intervals[filters.period];
    if (interval !== undefined) {
      conditions.push(
        filters.period === "today"
          ? `s.created_at::date = CURRENT_DATE`
          : `s.created_at >= NOW() - INTERVAL '${interval}'`
      );
    }
  }
  if (filters?.location) {
    params.push(`%${filters.location}%`);
    conditions.push(
      `EXISTS (SELECT 1 FROM bookings b JOIN addresses a ON a.id = b.address_id WHERE b.service_type = s.title AND a.street ILIKE $${params.length})`
    );
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const rows = await db.query(
    `SELECT s.id, s.title AS name, s.image_url, s.status, s.created_at AS date_added,
            (SELECT COALESCE(AVG(r.rating), 0)::float FROM reviews r JOIN bookings b ON b.id = r.booking_id WHERE b.service_type = s.title) AS rating,
            RANK() OVER (ORDER BY (SELECT COUNT(*) FROM bookings b WHERE b.service_type = s.title) DESC) AS popularity_rank
     FROM services s ${where}
     ORDER BY s.display_order, s.created_at`,
    params
  ) as Record<string, unknown>[];

  const stats = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE s.status = 'active')::int AS active,
            COUNT(*) FILTER (WHERE s.status = 'archived')::int AS archived
     FROM services s ${where}`,
    params
  ) as { total: number; active: number; archived: number }[];

  return { data: rows, stats: stats[0]! };
}

export async function getServiceAdmin(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT id, title AS name, description, image_url, status, created_at AS date_added FROM services WHERE id = $1`, [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function createService(
  name: string,
  slug: string,
  description: string,
  imageUrl: string | null,
  iconUrl?: string | null
): Promise<{ id: string; name: string; status: string }> {
  const rows = await db.query(
    `INSERT INTO services (title, slug, description, image_url, icon_url, status)
     VALUES ($1, $2, $3, $4, $5, 'active') RETURNING id, title AS name, status`,
    [name, slug, description, imageUrl, iconUrl ?? null]
  ) as { id: string; name: string; status: string }[];
  return rows[0]!;
}

export async function updateService(
  id: string,
  fields: Record<string, string | number>
): Promise<Record<string, unknown> | null> {
  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    params.push(val);
  }

  if (sets.length === 0) return null;
  params.push(id);
  const rows = await db.query(
    `UPDATE services SET ${sets.join(", ")} WHERE id = $${idx} RETURNING id, title AS name, description, image_url, status`,
    params
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function updateBlogCoverImage(
  postId: string,
  coverUrl: string
): Promise<{ id: string } | null> {
  const rows = await db.query(
    `UPDATE blog_posts SET cover_image_url = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING id`,
    [coverUrl, postId]
  ) as { id: string }[];
  return rows[0] ?? null;
}

export async function archiveService(id: string): Promise<{ id: string; title: string } | null> {
  const rows = await db.query(
    `UPDATE services SET status = 'archived' WHERE id = $1 AND status = 'active' RETURNING id, title`,
    [id]
  ) as { id: string; title: string }[];
  return rows[0] ?? null;
}

export async function unarchiveService(id: string): Promise<{ id: string; title: string } | null> {
  const rows = await db.query(
    `UPDATE services SET status = 'active' WHERE id = $1 AND status = 'archived' RETURNING id, title`,
    [id]
  ) as { id: string; title: string }[];
  return rows[0] ?? null;
}

// ── Admin Cost Guides CRUD ─────────────────────────────────────────────

export async function listCostGuidesAdmin(
  filters?: { status?: string; period?: string; search?: string }
): Promise<{ data: Record<string, unknown>[]; stats: { total: number; active: number; archived: number } }> {
  const conditions: string[] = ["deleted_at IS NULL"];
  const params: (string | number)[] = [];

  if (filters?.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}`);
  }
  if (filters?.search) {
    params.push(`%${filters.search}%`);
    conditions.push(`title ILIKE $${params.length}`);
  }
  if (filters?.period) {
    const intervals: Record<string, string> = {
      today: "0 days", this_month: "1 month",
      past_3_months: "3 months", past_6_months: "6 months", past_year: "1 year",
    };
    const interval = intervals[filters.period];
    if (interval !== undefined) {
      conditions.push(
        filters.period === "today"
          ? `created_at::date = CURRENT_DATE`
          : `created_at >= NOW() - INTERVAL '${interval}'`
      );
    }
  }

  const where = conditions.join(" AND ");

  const rows = await db.query(
    `SELECT id, title, status, created_at AS date_added, updated_at AS last_edit
     FROM cost_guides WHERE ${where} ORDER BY created_at DESC`,
    params
  ) as Record<string, unknown>[];

  const stats = await db.query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'active')::int AS active,
            COUNT(*) FILTER (WHERE status = 'archived')::int AS archived
     FROM cost_guides WHERE ${where}`,
    params
  ) as { total: number; active: number; archived: number }[];

  return { data: rows, stats: stats[0]! };
}

export async function getCostGuideAdmin(id: string): Promise<Record<string, unknown> | null> {
  const rows = await db.query(
    `SELECT id, title, excerpt AS description, content_blocks, status, created_at AS date_added
     FROM cost_guides WHERE id = $1 AND deleted_at IS NULL`, [id]
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function createCostGuide(
  title: string,
  slug: string,
  description: string,
  contentBlocks: string
): Promise<{ id: string; title: string; status: string }> {
  const rows = await db.query(
    `INSERT INTO cost_guides (title, slug, excerpt, content_blocks, status, published_at)
     VALUES ($1, $2, $3, $4, 'active', NOW()) RETURNING id, title, status`,
    [title, slug, description, contentBlocks]
  ) as { id: string; title: string; status: string }[];
  return rows[0]!;
}

export async function updateCostGuide(
  id: string,
  fields: Record<string, string | number>
): Promise<Record<string, unknown> | null> {
  const sets: string[] = [];
  const params: (string | number)[] = [];
  let idx = 1;

  for (const [key, val] of Object.entries(fields)) {
    sets.push(`${key} = $${idx++}`);
    params.push(val);
  }

  if (sets.length === 0) return null;
  params.push(id);
  const rows = await db.query(
    `UPDATE cost_guides SET ${sets.join(", ")} WHERE id = $${idx} AND deleted_at IS NULL
     RETURNING id, title, excerpt AS description, content_blocks, status`,
    params
  ) as Record<string, unknown>[];
  return rows[0] ?? null;
}

export async function archiveCostGuide(id: string): Promise<{ id: string; title: string } | null> {
  const rows = await db.query(
    `UPDATE cost_guides SET status = 'archived' WHERE id = $1 AND status = 'active' AND deleted_at IS NULL RETURNING id, title`,
    [id]
  ) as { id: string; title: string }[];
  return rows[0] ?? null;
}

export async function unarchiveCostGuide(id: string): Promise<{ id: string; title: string } | null> {
  const rows = await db.query(
    `UPDATE cost_guides SET status = 'active' WHERE id = $1 AND status = 'archived' AND deleted_at IS NULL RETURNING id, title`,
    [id]
  ) as { id: string; title: string }[];
  return rows[0] ?? null;
}
