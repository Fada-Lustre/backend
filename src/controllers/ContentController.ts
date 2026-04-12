import { Controller, Get, Path, Query, Route, Tags, Response } from "tsoa";
import db from "../db";
import type { Service, BlogCategory, BlogPost, Faq, CostGuide, CostGuideDetail, Location } from "../types/content";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/services")
@Tags("Services")
export class ServicesController extends Controller {
  /**
   * List all active cleaning services. Supports optional search by title.
   */
  @Get("/")
  @Response<ErrorResponse>(500, "Server error")
  public async listServices(
    @Query() search?: string
  ): Promise<ListResponse<Service>> {
    const rows = search
      ? await db.query(
          `SELECT * FROM services WHERE deleted_at IS NULL AND title ILIKE $1 ORDER BY display_order ASC`,
          [`%${search}%`]
        )
      : await db.query(
          `SELECT * FROM services WHERE deleted_at IS NULL ORDER BY display_order ASC`
        );
    return { data: rows as Service[], meta: { total: rows.length } };
  }

  /**
   * Get a single service by its URL slug.
   */
  @Get("{slug}")
  @Response<ErrorResponse>(404, "Service not found")
  @Response<ErrorResponse>(500, "Server error")
  public async getService(@Path() slug: string): Promise<Service> {
    const rows = await db.query(
      "SELECT * FROM services WHERE slug = $1 AND deleted_at IS NULL",
      [slug]
    );
    if (rows.length === 0) {
      this.setStatus(404);
      throw Object.assign(new Error("Service not found"), {
        status: 404,
        error: { code: "NOT_FOUND", message: "Service not found" },
      });
    }
    return rows[0] as Service;
  }
}

@Route("v1/blog")
@Tags("Blog")
export class BlogController extends Controller {
  /**
   * List all blog categories.
   */
  @Get("categories")
  public async listCategories(): Promise<ListResponse<BlogCategory>> {
    const rows = await db.query(
      "SELECT id, name, slug FROM blog_categories WHERE deleted_at IS NULL ORDER BY name ASC"
    );
    return { data: rows as BlogCategory[], meta: { total: rows.length } };
  }

  /**
   * List blog posts. Filterable by category slug, searchable by title/excerpt.
   */
  @Get("posts")
  public async listPosts(
    @Query() category?: string,
    @Query() search?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<BlogPost>> {
    const pageNum = page ?? 1;
    const pageSize = Math.min(limit ?? 12, 50);
    const offset = (pageNum - 1) * pageSize;

    const conditions: string[] = ["p.deleted_at IS NULL", "p.published_at IS NOT NULL"];
    const params: (string | number)[] = [];

    if (category) {
      params.push(category);
      conditions.push(`c.slug = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.title ILIKE $${params.length} OR p.excerpt ILIKE $${params.length})`);
    }

    const where = conditions.join(" AND ");
    params.push(pageSize, offset);

    const rows = await db.query(
      `SELECT p.id, p.created_at, p.title, p.slug, p.excerpt, p.cover_image_url, p.author, p.published_at,
              c.name AS category_name, c.slug AS category_slug
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE ${where}
       ORDER BY p.published_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params as string[]
    );

    const countRows = await db.query(
      `SELECT COUNT(*) FROM blog_posts p LEFT JOIN blog_categories c ON p.category_id = c.id WHERE ${where}`,
      params.slice(0, -2) as string[]
    );

    return {
      data: rows as BlogPost[],
      meta: { total: parseInt((countRows[0] as any).count, 10), page: pageNum, limit: pageSize },
    };
  }

  /**
   * Get a single blog post by its URL slug.
   */
  @Get("posts/{slug}")
  @Response<ErrorResponse>(404, "Post not found")
  public async getPost(@Path() slug: string): Promise<BlogPost> {
    const rows = await db.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.deleted_at IS NULL`,
      [slug]
    );
    if (rows.length === 0) {
      this.setStatus(404);
      throw Object.assign(new Error("Post not found"), {
        status: 404,
        error: { code: "NOT_FOUND", message: "Post not found" },
      });
    }
    return rows[0] as BlogPost;
  }
}

@Route("v1/faqs")
@Tags("FAQs")
export class FaqsController extends Controller {
  /**
   * List all FAQs. Supports optional search by question text.
   */
  @Get("/")
  public async listFaqs(@Query() search?: string): Promise<ListResponse<Faq>> {
    const rows = search
      ? await db.query(
          `SELECT id, question, answer, display_order FROM faqs WHERE deleted_at IS NULL AND question ILIKE $1 ORDER BY display_order ASC`,
          [`%${search}%`]
        )
      : await db.query(
          `SELECT id, question, answer, display_order FROM faqs WHERE deleted_at IS NULL ORDER BY display_order ASC`
        );
    return { data: rows as Faq[], meta: { total: rows.length } };
  }
}

@Route("v1/cost-guides")
@Tags("Cost Guides")
export class CostGuidesController extends Controller {
  /**
   * List all cost guides (summary view).
   */
  @Get("/")
  public async listCostGuides(): Promise<ListResponse<CostGuide>> {
    const rows = await db.query(
      `SELECT id, title, slug, excerpt, published_at FROM cost_guides WHERE deleted_at IS NULL ORDER BY published_at DESC`
    );
    return { data: rows as CostGuide[], meta: { total: rows.length } };
  }

  /**
   * Get a single cost guide by slug, including the full pricing table.
   */
  @Get("{slug}")
  @Response<ErrorResponse>(404, "Cost guide not found")
  public async getCostGuide(@Path() slug: string): Promise<CostGuideDetail> {
    const rows = await db.query(
      "SELECT * FROM cost_guides WHERE slug = $1 AND deleted_at IS NULL",
      [slug]
    );
    if (rows.length === 0) {
      this.setStatus(404);
      throw Object.assign(new Error("Cost guide not found"), {
        status: 404,
        error: { code: "NOT_FOUND", message: "Cost guide not found" },
      });
    }
    const guide = rows[0] as any;
    const pricing = await db.query(
      `SELECT id, service_category, rate, explanation, display_order
       FROM cost_guide_pricing WHERE cost_guide_id = $1 ORDER BY display_order ASC`,
      [guide.id]
    );
    return { ...guide, pricing_table: pricing };
  }
}

@Route("v1/locations")
@Tags("Locations")
export class LocationsController extends Controller {
  /**
   * List all active service locations.
   */
  @Get("/")
  public async listLocations(): Promise<ListResponse<Location>> {
    const rows = await db.query(
      "SELECT id, name, region, country, status FROM locations WHERE status = 'active' ORDER BY name ASC"
    );
    return { data: rows as Location[], meta: { total: rows.length } };
  }
}
