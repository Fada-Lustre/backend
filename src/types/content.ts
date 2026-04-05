export interface Service {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  icon_url: string | null;
  display_order: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
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

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface CostGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published_at: string | null;
}

export interface CostGuideDetail extends CostGuide {
  content: string;
  pricing_table: CostGuidePricingRow[];
}

export interface CostGuidePricingRow {
  id: string;
  service_category: string;
  rate: string;
  explanation: string | null;
  display_order: number;
}

export interface Location {
  id: string;
  name: string;
  region: string;
  country: string;
  status: string;
}
