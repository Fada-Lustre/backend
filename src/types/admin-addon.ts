import type { AddOnSlug } from "./quotes";

export interface AdminAddOn {
  id: string;
  name: string;
  slug: AddOnSlug;
  hours_added: number;
  active: boolean;
  /** Presigned URL for the add-on image (null if none uploaded) */
  image_url: string | null;
}
