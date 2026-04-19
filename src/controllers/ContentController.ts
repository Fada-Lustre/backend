import { Controller, Get, Path, Query, Route, Tags, Response } from "tsoa";
import * as contentService from "../services/content.service";
import type { Service, BlogCategory, BlogPost, Faq, CostGuide, CostGuideDetail, Location } from "../types/content";
import type { ListResponse, ErrorResponse } from "../types/common";

@Route("v1/services")
@Tags("Services")
export class ServicesController extends Controller {
  @Get("/")
  @Response<ErrorResponse>(500, "Server error")
  public async listServices(
    @Query() search?: string
  ): Promise<ListResponse<Service>> {
    return contentService.listServices(search);
  }

  @Get("{slug}")
  @Response<ErrorResponse>(404, "Service not found")
  public async getService(@Path() slug: string): Promise<Service> {
    return contentService.getServiceBySlug(slug);
  }
}

@Route("v1/blog")
@Tags("Blog")
export class BlogController extends Controller {
  @Get("categories")
  public async listCategories(): Promise<ListResponse<BlogCategory>> {
    return contentService.listCategories();
  }

  @Get("posts")
  public async listPosts(
    @Query() category?: string,
    @Query() search?: string,
    @Query() page?: number,
    @Query() limit?: number
  ): Promise<ListResponse<BlogPost>> {
    return contentService.listPosts(category, search, page ?? 1, limit ?? 12);
  }

  @Get("posts/{slug}")
  @Response<ErrorResponse>(404, "Post not found")
  public async getPost(@Path() slug: string): Promise<BlogPost> {
    return contentService.getPostBySlug(slug);
  }
}

@Route("v1/faqs")
@Tags("FAQs")
export class FaqsController extends Controller {
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
  @Get("/")
  public async listCostGuides(): Promise<ListResponse<CostGuide>> {
    return contentService.listCostGuides();
  }

  @Get("{slug}")
  @Response<ErrorResponse>(404, "Cost guide not found")
  public async getCostGuide(@Path() slug: string): Promise<CostGuideDetail> {
    return contentService.getCostGuideBySlug(slug);
  }
}

@Route("v1/locations")
@Tags("Locations")
export class LocationsController extends Controller {
  @Get("/")
  public async listLocations(): Promise<ListResponse<Location>> {
    return contentService.listLocations();
  }
}
