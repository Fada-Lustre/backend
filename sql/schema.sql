BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  service_type TEXT NOT NULL DEFAULT 'domestic',
  role TEXT NOT NULL DEFAULT 'customer'
);

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- CONTENT DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  icon_url TEXT,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published_at DESC)
  WHERE published_at IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts (category_id)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cost_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS cost_guide_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cost_guide_id UUID NOT NULL REFERENCES cost_guides(id) ON DELETE CASCADE,
  service_category TEXT NOT NULL,
  rate TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'England',
  status TEXT NOT NULL DEFAULT 'active',
  UNIQUE (name, region)
);

-- ============================================================
-- QUOTING & PRICING DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS pricing_config (
  key TEXT PRIMARY KEY,
  value NUMERIC(10, 2) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO pricing_config (key, value) VALUES
  ('hourly_rate', 22.50),
  ('cleaning_products_fee', 6.00),
  ('service_fee', 2.50),
  ('weekend_surcharge', 10.00)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS add_ons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  hours_added NUMERIC(4, 2) NOT NULL DEFAULT 0.5,
  active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO add_ons (name, slug, hours_added) VALUES
  ('Oven', 'oven', 0.50),
  ('Fridge', 'fridge', 0.50),
  ('Windows', 'windows', 0.50),
  ('Chairs', 'chairs', 0.50)
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  postcode TEXT NOT NULL,
  rooms INT NOT NULL,
  bathrooms INT NOT NULL,
  add_ons JSONB NOT NULL DEFAULT '[]',
  hours NUMERIC(4, 1) NOT NULL,
  cleaning_products TEXT NOT NULL DEFAULT 'bring',
  frequency TEXT NOT NULL,
  preferred_days JSONB NOT NULL DEFAULT '[]',
  email TEXT NOT NULL,
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  total NUMERIC(10, 2) NOT NULL,
  line_items_json JSONB NOT NULL DEFAULT '[]',
  preferred_date DATE,
  preferred_time TEXT,
  weekend_surcharge NUMERIC(10, 2) NOT NULL DEFAULT 0,
  final_total NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'draft'
);

DROP TRIGGER IF EXISTS quotes_updated_at ON quotes;
CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- LEAD & SUPPORT DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT
);

CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_description TEXT NOT NULL,
  preferred_date TEXT,
  location TEXT
);

-- ============================================================
-- CLEANER ONBOARDING DOMAIN
-- ============================================================

CREATE TABLE IF NOT EXISTS cleaner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  country_code TEXT NOT NULL DEFAULT '+44',
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  gender TEXT NOT NULL,
  postcode TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  experience_types JSONB NOT NULL DEFAULT '[]',
  experience_description TEXT NOT NULL DEFAULT '',
  hours_per_week INT NOT NULL,
  available_days JSONB NOT NULL DEFAULT '[]',
  commitment_duration TEXT NOT NULL,
  right_to_work_uk BOOLEAN NOT NULL DEFAULT FALSE,
  has_uk_bank_account BOOLEAN NOT NULL DEFAULT FALSE,
  understands_self_employed BOOLEAN NOT NULL DEFAULT FALSE,
  no_criminal_record BOOLEAN NOT NULL DEFAULT FALSE,
  accepts_terms BOOLEAN NOT NULL DEFAULT FALSE,
  photo_url TEXT,
  photo_public_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_cleaner_applications_status ON cleaner_applications (status);
CREATE INDEX IF NOT EXISTS idx_cleaner_applications_email ON cleaner_applications (email);

-- ============================================================
-- TRIGGERS
-- ============================================================

DROP TRIGGER IF EXISTS set_services_updated_at ON services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

DROP TRIGGER IF EXISTS set_faqs_updated_at ON faqs;
CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

DROP TRIGGER IF EXISTS set_cost_guides_updated_at ON cost_guides;
CREATE TRIGGER set_cost_guides_updated_at
  BEFORE UPDATE ON cost_guides FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

DROP TRIGGER IF EXISTS set_cleaner_applications_updated_at ON cleaner_applications;
CREATE TRIGGER set_cleaner_applications_updated_at
  BEFORE UPDATE ON cleaner_applications FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- SEED DATA (services from screens)
-- ============================================================

INSERT INTO services (title, slug, description, display_order) VALUES
  ('Domestic Cleaning', 'domestic-cleaning', 'Professional home cleaning services tailored to your needs.', 1),
  ('Commercial Cleaning', 'commercial-cleaning', 'Keep your office or workspace spotless and professional.', 2),
  ('Hotel Cleaning', 'hotel-cleaning', 'Hospitality-grade cleaning for hotels and guest accommodations.', 3),
  ('End of Tenancy Cleaning', 'end-of-tenancy-cleaning', 'Thorough cleaning to meet landlord and agency standards.', 4),
  ('Appliance Cleaning', 'appliance-cleaning', 'Deep cleaning for ovens, fridges, and household appliances.', 5),
  ('Laundry Services', 'laundry-services', 'Professional laundry, ironing, and fabric care.', 6)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_categories (name, slug) VALUES
  ('Tips', 'tips'),
  ('Tenancy', 'tenancy'),
  ('Office', 'office'),
  ('Seasonal', 'seasonal')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, region, country, status) VALUES
  ('Derby', 'Derbyshire', 'England', 'active')
ON CONFLICT (name, region) DO NOTHING;

-- ============================================================
-- USERS TABLE EXPANSION (mobile app support)
-- All new columns nullable or have defaults — backward compatible
-- ============================================================

ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+44';
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_public_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_avg NUMERIC(2,1) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS transaction_pin_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_street TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_country TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_postcode TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_floor_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_door_number TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS home_entrance_notes TEXT;

-- Admin columns (merged from former admin_users table)
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_role_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS invited_by UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- ============================================================
-- AUTH & IDENTITY — OTP CODES
-- ============================================================

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  phone TEXT,
  email TEXT,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_phone_purpose
  ON otp_codes (phone, purpose, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_purpose
  ON otp_codes (email, purpose, created_at DESC);

-- ============================================================
-- AUTH & IDENTITY — ADMIN INVITATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role_id UUID NOT NULL,
  temp_password_hash TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  activated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADDRESSES
-- ============================================================

CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  street TEXT NOT NULL,
  floor_number TEXT,
  door_number TEXT,
  additional_info TEXT,
  entrance_notes TEXT,
  label TEXT NOT NULL DEFAULT 'home',
  custom_label TEXT,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_addresses_user
  ON addresses (user_id) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS addresses_updated_at ON addresses;
CREATE TRIGGER addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- BOOKING ENGINE — BOOKINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cleaner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  condition TEXT,
  property_type TEXT,
  total_sq_metres INT,
  rooms INT NOT NULL,
  floors INT NOT NULL DEFAULT 1,
  bathrooms INT NOT NULL,
  add_ons JSONB NOT NULL DEFAULT '[]',
  scheduled_date DATE NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT,
  additional_info TEXT,
  use_same_cleaner BOOLEAN NOT NULL DEFAULT false,
  booking_fee NUMERIC(10,2) NOT NULL,
  charges NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL,
  tip_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'unassigned',
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES users(id) ON DELETE SET NULL,
  rebooked_from_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  transaction_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_status
  ON bookings (customer_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_cleaner_status
  ON bookings (cleaner_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date
  ON bookings (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_active
  ON bookings (status) WHERE status NOT IN ('done', 'cancelled');

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- BOOKING ENGINE — AMENDMENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS booking_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  floors INT,
  rooms INT,
  bathrooms INT,
  add_ons JSONB,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BOOKING ENGINE — IMAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS booking_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_public_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS & BILLING — PAYMENT METHODS
-- ============================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider_token TEXT,
  last4 TEXT,
  brand TEXT,
  card_holder_name TEXT,
  card_expiry TEXT,
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_type
  ON payment_methods (user_id, type) WHERE deleted_at IS NULL;

-- ============================================================
-- PAYMENTS & BILLING — TRANSACTIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_number TEXT UNIQUE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  payer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  payee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_type_status
  ON transactions (type, status);
CREATE INDEX IF NOT EXISTS idx_transactions_booking
  ON transactions (booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payer
  ON transactions (payer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payee
  ON transactions (payee_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created
  ON transactions (created_at DESC);

DROP TRIGGER IF EXISTS transactions_updated_at ON transactions;
CREATE TRIGGER transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- CLEANER WORKFORCE — AVAILABILITY
-- ============================================================

CREATE TABLE IF NOT EXISTS cleaner_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'every_day',
  default_start TEXT,
  default_end TEXT,
  schedule JSONB NOT NULL DEFAULT '{}',
  accept_bookings BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CLEANER WORKFORCE — WITHDRAWALS
-- ============================================================

CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method_id UUID NOT NULL REFERENCES payment_methods(id) ON DELETE RESTRICT,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  failed_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================
-- RATINGS & REVIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (booking_id, reviewer_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewee
  ON reviews (reviewee_id, created_at DESC);

-- Trigger for update_user_rating is defined later alongside the function

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_unread
  ON notifications (user_id, read_at) WHERE read_at IS NULL;

-- ============================================================
-- SUPPORT — TICKETS
-- ============================================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS support_tickets_updated_at ON support_tickets;
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

-- ============================================================
-- SUPPORT — MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_bot BOOLEAN NOT NULL DEFAULT false,
  body TEXT NOT NULL,
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN OPERATIONS — ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  UNIQUE (role_id, permission)
);

-- Add deferred FK from admin_invitations to roles (table now exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'admin_invitations_role_id_fkey'
      AND table_name = 'admin_invitations'
  ) THEN
    ALTER TABLE admin_invitations
      ADD CONSTRAINT admin_invitations_role_id_fkey
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Deferred FK: users.admin_role_id → roles (table now exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_admin_role_id_fkey'
      AND table_name = 'users'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_admin_role_id_fkey
      FOREIGN KEY (admin_role_id) REFERENCES roles(id) ON DELETE RESTRICT;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_invited_by_fkey'
      AND table_name = 'users'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_invited_by_fkey
      FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_admin_role
  ON users (admin_role_id) WHERE admin_role_id IS NOT NULL;

-- ============================================================
-- ADMIN OPERATIONS — ACTIVITY LOG
-- ============================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_created
  ON activity_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_actor
  ON activity_log (actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity
  ON activity_log (entity_type, entity_id);

-- ============================================================
-- SEED DATA — ROLES & PERMISSIONS
-- ============================================================

INSERT INTO roles (name, display_name, is_system) VALUES
  ('super_admin', 'Super Admin', true),
  ('admin', 'Admin', true),
  ('manager', 'Manager', true),
  ('support', 'Support', true)
ON CONFLICT (name) DO NOTHING;

-- Super Admin: all permissions
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

-- Admin: all pages except user management and permission control
INSERT INTO role_permissions (role_id, permission)
SELECT r.id, p.perm
FROM roles r
CROSS JOIN (VALUES
  ('home'), ('bookings'), ('customers'), ('cleaners'),
  ('services'), ('cost_guides'), ('transactions'), ('support')
) AS p(perm)
WHERE r.name = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission = p.perm
  );

-- Manager: bookings, customers, cleaners
INSERT INTO role_permissions (role_id, permission)
SELECT r.id, p.perm
FROM roles r
CROSS JOIN (VALUES
  ('home'), ('bookings'), ('customers'), ('cleaners')
) AS p(perm)
WHERE r.name = 'manager'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission = p.perm
  );

-- Support: support only
INSERT INTO role_permissions (role_id, permission)
SELECT r.id, p.perm
FROM roles r
CROSS JOIN (VALUES ('home'), ('support')) AS p(perm)
WHERE r.name = 'support'
  AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp
    WHERE rp.role_id = r.id AND rp.permission = p.perm
  );

-- ============================================================
-- REMEDIATION: FK POLICY HARDENING (soft-delete safety net)
-- Users are never hard-deleted; RESTRICT prevents accidental
-- hard deletes from destroying financial/audit/review data.
-- ============================================================

DO $$ BEGIN
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_customer_id_fkey;
  ALTER TABLE bookings ADD CONSTRAINT bookings_customer_id_fkey
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_cleaner_id_fkey;
  ALTER TABLE bookings ADD CONSTRAINT bookings_cleaner_id_fkey
    FOREIGN KEY (cleaner_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE withdrawals DROP CONSTRAINT IF EXISTS withdrawals_cleaner_id_fkey;
  ALTER TABLE withdrawals ADD CONSTRAINT withdrawals_cleaner_id_fkey
    FOREIGN KEY (cleaner_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewer_id_fkey;
  ALTER TABLE reviews ADD CONSTRAINT reviews_reviewer_id_fkey
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_reviewee_id_fkey;
  ALTER TABLE reviews ADD CONSTRAINT reviews_reviewee_id_fkey
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE booking_images DROP CONSTRAINT IF EXISTS booking_images_uploaded_by_fkey;
  ALTER TABLE booking_images ADD CONSTRAINT booking_images_uploaded_by_fkey
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS support_tickets_user_id_fkey;
  ALTER TABLE support_tickets ADD CONSTRAINT support_tickets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE admin_invitations DROP CONSTRAINT IF EXISTS admin_invitations_invited_by_fkey;
  ALTER TABLE admin_invitations ALTER COLUMN invited_by DROP NOT NULL;
  ALTER TABLE admin_invitations ADD CONSTRAINT admin_invitations_invited_by_fkey
    FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_actor_id_fkey;
  ALTER TABLE activity_log ADD CONSTRAINT activity_log_actor_id_fkey
    FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;
  ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
  ALTER TABLE addresses ADD CONSTRAINT addresses_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE payment_methods DROP CONSTRAINT IF EXISTS payment_methods_user_id_fkey;
  ALTER TABLE payment_methods ADD CONSTRAINT payment_methods_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE cleaner_availability DROP CONSTRAINT IF EXISTS cleaner_availability_cleaner_id_fkey;
  ALTER TABLE cleaner_availability ADD CONSTRAINT cleaner_availability_cleaner_id_fkey
    FOREIGN KEY (cleaner_id) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

DO $$ BEGIN
  ALTER TABLE booking_amendments DROP CONSTRAINT IF EXISTS booking_amendments_requested_by_fkey;
  ALTER TABLE booking_amendments ADD CONSTRAINT booking_amendments_requested_by_fkey
    FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT;
END $$;

-- ============================================================
-- REMEDIATION: CHECK CONSTRAINTS — STATUS/TYPE COLUMNS
-- ============================================================

ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_role;
ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('customer','cleaner','admin'));

ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_status;
ALTER TABLE users ADD CONSTRAINT chk_users_status CHECK (status IN ('active','inactive','blocked'));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_status;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_status CHECK (status IN ('unassigned','scheduled','on_the_way','ongoing','done','cancelled'));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_payment_status;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_payment_status CHECK (payment_status IN ('pending','successful','failed','refunded','partially_refunded'));

ALTER TABLE quotes DROP CONSTRAINT IF EXISTS chk_quotes_status;
ALTER TABLE quotes ADD CONSTRAINT chk_quotes_status CHECK (status IN ('draft','scheduled','booked'));

ALTER TABLE quotes DROP CONSTRAINT IF EXISTS chk_quotes_cleaning_products;
ALTER TABLE quotes ADD CONSTRAINT chk_quotes_cleaning_products CHECK (cleaning_products IN ('bring','provide'));

ALTER TABLE cleaner_applications DROP CONSTRAINT IF EXISTS chk_cleaner_applications_status;
ALTER TABLE cleaner_applications ADD CONSTRAINT chk_cleaner_applications_status CHECK (status IN ('draft','submitted','under_review','approved','rejected'));

ALTER TABLE admin_invitations DROP CONSTRAINT IF EXISTS chk_admin_invitations_status;
ALTER TABLE admin_invitations ADD CONSTRAINT chk_admin_invitations_status CHECK (status IN ('pending','activated','expired'));

ALTER TABLE booking_amendments DROP CONSTRAINT IF EXISTS chk_booking_amendments_status;
ALTER TABLE booking_amendments ADD CONSTRAINT chk_booking_amendments_status CHECK (status IN ('pending','approved','rejected'));

ALTER TABLE support_tickets DROP CONSTRAINT IF EXISTS chk_support_tickets_status;
ALTER TABLE support_tickets ADD CONSTRAINT chk_support_tickets_status CHECK (status IN ('open','in_progress','resolved','closed'));

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS chk_transactions_type;
ALTER TABLE transactions ADD CONSTRAINT chk_transactions_type CHECK (type IN ('booking','payout','refund','tip'));

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS chk_transactions_status;
ALTER TABLE transactions ADD CONSTRAINT chk_transactions_status CHECK (status IN ('pending','successful','failed'));

ALTER TABLE withdrawals DROP CONSTRAINT IF EXISTS chk_withdrawals_status;
ALTER TABLE withdrawals ADD CONSTRAINT chk_withdrawals_status CHECK (status IN ('pending','successful','failed'));

ALTER TABLE otp_codes DROP CONSTRAINT IF EXISTS chk_otp_codes_purpose;
ALTER TABLE otp_codes ADD CONSTRAINT chk_otp_codes_purpose CHECK (purpose IN ('registration','login','phone_update','password_reset'));

ALTER TABLE cleaner_availability DROP CONSTRAINT IF EXISTS chk_cleaner_availability_mode;
ALTER TABLE cleaner_availability ADD CONSTRAINT chk_cleaner_availability_mode CHECK (mode IN ('every_day','weekdays','weekends','custom'));

ALTER TABLE payment_methods DROP CONSTRAINT IF EXISTS chk_payment_methods_type;
ALTER TABLE payment_methods ADD CONSTRAINT chk_payment_methods_type CHECK (type IN ('card','apple_pay','google_pay','cash','bank_account'));

ALTER TABLE locations DROP CONSTRAINT IF EXISTS chk_locations_status;
ALTER TABLE locations ADD CONSTRAINT chk_locations_status CHECK (status IN ('active','coming_soon'));

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_service_type;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_service_type CHECK (service_type IN ('domestic','commercial','hotel','laundry','end_of_tenancy','appliance'));

ALTER TABLE quotes DROP CONSTRAINT IF EXISTS chk_quotes_frequency;
ALTER TABLE quotes ADD CONSTRAINT chk_quotes_frequency CHECK (frequency IN ('one-off','2-3-times-a-week','every-week','every-2-weeks'));

-- ============================================================
-- REMEDIATION: CHECK CONSTRAINTS — MONETARY COLUMNS
-- ============================================================

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_booking_fee;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_booking_fee CHECK (booking_fee >= 0);
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_charges;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_charges CHECK (charges >= 0);
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_discount;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_discount CHECK (discount >= 0);
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_total_price;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_total_price CHECK (total_price >= 0);
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS chk_bookings_tip_amount;
ALTER TABLE bookings ADD CONSTRAINT chk_bookings_tip_amount CHECK (tip_amount >= 0);

ALTER TABLE transactions DROP CONSTRAINT IF EXISTS chk_transactions_amount;
ALTER TABLE transactions ADD CONSTRAINT chk_transactions_amount CHECK (amount > 0);

ALTER TABLE withdrawals DROP CONSTRAINT IF EXISTS chk_withdrawals_amount;
ALTER TABLE withdrawals ADD CONSTRAINT chk_withdrawals_amount CHECK (amount > 0);

ALTER TABLE quotes DROP CONSTRAINT IF EXISTS chk_quotes_total;
ALTER TABLE quotes ADD CONSTRAINT chk_quotes_total CHECK (total >= 0);
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS chk_quotes_weekend_surcharge;
ALTER TABLE quotes ADD CONSTRAINT chk_quotes_weekend_surcharge CHECK (weekend_surcharge >= 0);

-- ============================================================
-- REMEDIATION: MISSING FK INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_cost_guide_pricing_guide ON cost_guide_pricing (cost_guide_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets (user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets (assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket ON support_messages (ticket_id);
CREATE INDEX IF NOT EXISTS idx_booking_images_booking ON booking_images (booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_amendments_booking ON booking_amendments (booking_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_cleaner ON withdrawals (cleaner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users (phone) WHERE phone IS NOT NULL;

-- ============================================================
-- REMEDIATION: TRIGGER, COLUMN, PRECISION, UNIQUE FIXES
-- ============================================================

ALTER TABLE cleaner_availability ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE services ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE cost_guides ADD COLUMN IF NOT EXISTS content_blocks JSONB NOT NULL DEFAULT '[]';
ALTER TABLE cost_guides ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

ALTER TABLE services DROP CONSTRAINT IF EXISTS chk_services_status;
ALTER TABLE services ADD CONSTRAINT chk_services_status CHECK (status IN ('active','archived'));

ALTER TABLE cost_guides DROP CONSTRAINT IF EXISTS chk_cost_guides_status;
ALTER TABLE cost_guides ADD CONSTRAINT chk_cost_guides_status CHECK (status IN ('active','archived'));

DROP TRIGGER IF EXISTS cleaner_availability_updated_at ON cleaner_availability;
CREATE TRIGGER cleaner_availability_updated_at
  BEFORE UPDATE ON cleaner_availability
  FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

CREATE OR REPLACE FUNCTION update_user_rating()
  RETURNS TRIGGER AS $$
  BEGIN
    UPDATE users SET
      rating_count = rating_count + 1,
      rating_avg = ROUND(((rating_avg * rating_count) + NEW.rating)::numeric / (rating_count + 1), 2)
    WHERE id = NEW.reviewee_id;
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_user_rating ON reviews;
CREATE TRIGGER trg_update_user_rating
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

ALTER TABLE users ALTER COLUMN rating_avg TYPE NUMERIC(3,2);

-- Payment state convention:
-- bookings.payment_status is the booking-scoped payment status (pending/successful/failed/refunded).
-- transactions.status is the authoritative financial record status.
-- On payment success, both should be updated within the same transaction.

COMMIT;
