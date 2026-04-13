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

CREATE INDEX idx_blog_posts_published ON blog_posts (published_at DESC)
  WHERE published_at IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX idx_blog_posts_category ON blog_posts (category_id)
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
  status TEXT NOT NULL DEFAULT 'active'
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
  status TEXT NOT NULL DEFAULT 'draft'
);

CREATE INDEX idx_cleaner_applications_status ON cleaner_applications (status);
CREATE INDEX idx_cleaner_applications_email ON cleaner_applications (email);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

CREATE TRIGGER set_faqs_updated_at
  BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

CREATE TRIGGER set_cost_guides_updated_at
  BEFORE UPDATE ON cost_guides FOR EACH ROW EXECUTE FUNCTION on_update_timestamp();

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
ON CONFLICT DO NOTHING;

COMMIT;
