-- Make *_public_id columns nullable so R2 uploads can optionally store the key
-- Previously these were NOT NULL (Cloudinary required them), but R2 uses the key as an optional reference

BEGIN;

ALTER TABLE booking_images ALTER COLUMN image_public_id DROP NOT NULL;
ALTER TABLE booking_images ALTER COLUMN image_public_id SET DEFAULT NULL;

-- users.profile_image_public_id is already nullable (added via ALTER TABLE ADD COLUMN which defaults to nullable)
-- cleaner_applications.photo_public_id is already nullable (no NOT NULL in CREATE TABLE)

COMMIT;
