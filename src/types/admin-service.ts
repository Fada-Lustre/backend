export interface AdminServiceListItem {
  id: string;
  name: string;
  rating: number | null;
  popularity: string | null;
  location: string | null;
  image_url: string | null;
  icon_url: string | null;
  date_added: string;
  status: string;
}

export interface AdminServiceDetail {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  icon_url: string | null;
  status: string;
  date_added: string;
}

export interface AdminServiceCreateResponse {
  id: string;
  name: string;
  status: string;
}
