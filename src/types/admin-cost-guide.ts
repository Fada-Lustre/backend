export interface ContentBlock {
  type: "callout" | "subtitle" | "text" | "table" | "button";
  title?: string;
  text?: string;
  rows?: { service_category: string; rate: string; explanation: string }[];
  url?: string;
  label?: string;
}

export interface AdminCostGuideListItem {
  id: string;
  title: string;
  status: string;
  date_added: string;
}

export interface AdminCostGuideDetail {
  id: string;
  title: string;
  description: string;
  content_blocks: ContentBlock[];
  status: string;
  date_added: string;
}

export interface CreateCostGuideRequest {
  title: string;
  description: string;
  content_blocks: ContentBlock[];
}

export interface UpdateCostGuideRequest {
  title?: string;
  description?: string;
  content_blocks?: ContentBlock[];
}
