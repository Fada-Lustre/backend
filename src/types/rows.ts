export type { CostGuidePricingRow } from "./content";

export interface PricingConfigRow {
  key: string;
  value: string;
}

export interface AddOnRow {
  id: string;
  name: string;
  slug: string;
  hours_added: string;
}

export interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  icon_url: string | null;
  display_order: number;
}

export interface BlogCategoryRow {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostRow {
  id: string;
  created_at: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  category_name: string | null;
  category_slug: string | null;
}

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface CostGuideRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string | null;
}

export interface LocationRow {
  id: string;
  name: string;
  region: string;
  country: string;
  status: string;
}

export interface QuoteIdRow {
  id: string;
}

export interface QuoteTotalRow {
  id: string;
  total: string;
}

export interface CountRow {
  count: string;
}

export interface CreatedRow {
  id: string;
  created_at: string;
}
