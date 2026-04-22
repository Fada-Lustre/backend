import { Controller, Get, Path, Query, Route, Tags, Response } from "tsoa";
import * as contentService from "../services/content.service";
import type { Service, BlogCategory, BlogPost, Faq, CostGuide, CostGuideDetail, Location } from "../types/content";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/services")
@Tags("Services")
export class ServicesController extends Controller {
  /**
   * Retrieve all active cleaning services. Supports optional text search.
   * Public endpoint — no authentication required.
   * @summary List services
   */
  @Get("/")
  @Response<ErrorResponse>(500, "Server error")
  public async listServices(
    @Query() search?: string
  ): Promise<ListResponse<Service>> {
    return contentService.listServices(search);
  }

  /**
   * Retrieve a single service by its URL-friendly slug.
   * @summary Get service by slug
   */
  @Get("{slug}")
  @Response<ErrorResponse>(404, "Service not found")
  public async getService(@Path() slug: string): Promise<Service> {
    return contentService.getServiceBySlug(slug);
  }
}

@Route("v1/blog")
@Tags("Blog")
export class BlogController extends Controller {
  /**
   * Retrieve all blog categories.
   * @summary List blog categories
   */
  @Get("categories")
  public async listCategories(): Promise<ListResponse<BlogCategory>> {
    return contentService.listCategories();
  }

  /**
   * Retrieve published blog posts with optional filtering by category, search,
   * and pagination.
   * @summary List blog posts
   */
  @Get("posts")
  public async listPosts(
    @Query() category?: string,
    @Query() search?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<BlogPost>> {
    return contentService.listPosts(category, search, page ?? 1, limit ?? 12);
  }

  /**
   * Retrieve a single blog post by its slug, including full content.
   * @summary Get blog post
   */
  @Get("posts/{slug}")
  @Response<ErrorResponse>(404, "Post not found")
  public async getPost(@Path() slug: string): Promise<BlogPost> {
    return contentService.getPostBySlug(slug);
  }
}

@Route("v1/faqs")
@Tags("FAQs")
export class FaqsController extends Controller {
  /**
   * Retrieve all frequently asked questions. Supports optional text search.
   * @summary List FAQs
   */
  @Get("/")
  public async listFaqs(
    @Query() search?: string
  ): Promise<ListResponse<Faq>> {
    return contentService.listFaqs(search);
  }
}

@Route("v1/cost-guides")
@Tags("Cost Guides")
export class CostGuidesController extends Controller {
  /**
   * Retrieve all published cost guides with title, description, and slug.
   * @summary List cost guides
   */
  @Get("/")
  public async listCostGuides(): Promise<ListResponse<CostGuide>> {
    return contentService.listCostGuides();
  }

  /**
   * Retrieve a single cost guide by slug with full content blocks.
   * @summary Get cost guide
   */
  @Get("{slug}")
  @Response<ErrorResponse>(404, "Cost guide not found")
  public async getCostGuide(@Path() slug: string): Promise<CostGuideDetail> {
    return contentService.getCostGuideBySlug(slug);
  }
}

@Route("v1/locations")
@Tags("Locations")
export class LocationsController extends Controller {
  /**
   * Retrieve all service locations (cities/areas where Fada Lustre operates).
   * @summary List locations
   */
  @Get("/")
  public async listLocations(): Promise<ListResponse<Location>> {
    return contentService.listLocations();
  }
}
