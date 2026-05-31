-- Add an optional image to add-ons so the admin can upload/display add-on artwork.
-- Stores the Cloudflare R2 object key (presigned on read), matching the platform invariant.

BEGIN;

ALTER TABLE add_ons ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMIT;
