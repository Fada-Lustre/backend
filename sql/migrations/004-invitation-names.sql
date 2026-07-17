-- Migration 004: store invited admin's name on the invitation so it can be
-- shown when listing pending invitations (fixes pending-invite listing).
ALTER TABLE admin_invitations ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE admin_invitations ADD COLUMN IF NOT EXISTS last_name TEXT;
