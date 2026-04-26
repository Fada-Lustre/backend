-- =============================================================
-- SEED: Super Admin account for frontend testing
-- Email:    admin@fadalustre.com
-- Password: FadaAdmin2026!
-- Role:     super_admin (all permissions)
-- Idempotent: safe to re-run (uses ON CONFLICT)
-- =============================================================

BEGIN;

-- 1. Ensure the super_admin role exists
INSERT INTO roles (name, display_name, is_system)
VALUES ('super_admin', 'Super Admin', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Ensure all permissions are granted
INSERT INTO role_permissions (role_id, permission)
SELECT r.id, p.perm
FROM roles r
CROSS JOIN (VALUES
  ('home'), ('bookings'), ('customers'), ('cleaners'),
  ('services'), ('cost_guides'), ('transactions'),
  ('support'), ('all_users'), ('control_permissions')
) AS p(perm)
WHERE r.name = 'super_admin'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission = p.perm
  );

-- 3. Insert the admin user
-- Password: FadaAdmin2026!  (bcrypt cost 10)
INSERT INTO users (
  first_name, last_name, email, password_hash, role,
  status, admin_role_id, activated_at
)
SELECT
  'Super', 'Admin', 'admin@fadalustre.com',
  '$2b$10$jPzJ3.jYJt23j0vcTMvylepmur9iFIabLASC6WV.4t2iXdemCdBPO',
  'admin', 'active', r.id, NOW()
FROM roles r WHERE r.name = 'super_admin'
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  admin_role_id = EXCLUDED.admin_role_id,
  activated_at = COALESCE(users.activated_at, NOW()),
  status = 'active';

COMMIT;
