-- Migration 005: add soft-delete column to cleaner_applications.
-- The schema (schema.sql) defines cleaner_applications.deleted_at, and the code
-- filters `WHERE deleted_at IS NULL` (leads.repository.ts), but older databases
-- were created before this column existed and never migrated — causing the
-- application photo route to fail with "column deleted_at does not exist" (42703).
ALTER TABLE cleaner_applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
