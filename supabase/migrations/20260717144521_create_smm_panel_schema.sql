/*
# SMM Panel - Full Schema

1. Overview
Creates a complete SMM (Social Media Marketing) panel schema with:
- profiles: extended user data (balance, role) linked to auth.users
- services: catalog of SMM services (category, platform, price per 1000, min/max, etc.)
- orders: customer orders placed against services
- transactions: balance top-ups / fund movements
- tickets: customer support tickets and replies
- api_keys: user-generated API keys for API access

2. New Tables
- profiles (id uuid PK -> auth.users, username, balance, role, created_at)
- services (id uuid PK, name, category, platform, price_per_1000, min_order, max_order, average_time, description, is_active, created_at)
- orders (id uuid PK, user_id -> auth.users, service_id -> services, link, quantity, charge, start_count, status, created_at, updated_at)
- transactions (id uuid PK, user_id -> auth.users, amount, type, description, created_at)
- tickets (id uuid PK, user_id -> auth.users, subject, status, priority, created_at, updated_at)
- ticket_replies (id uuid PK, ticket_id -> tickets, user_id -> auth.users, message, is_staff, created_at)
- api_keys (id uuid PK, user_id -> auth.users, key_value, label, created_at, last_used_at)

3. Security
- RLS enabled on all tables.
- profiles: owner can read/update own.
- services: public read (anon+authenticated); admin-only write.
- orders: owner can read/insert own; admin can read/update all.
- transactions: owner can read/insert own; admin can read all.
- tickets: owner can read/insert own; admin can read/update all.
- ticket_replies: owner (via ticket ownership) or admin can read; owner or admin can insert.
- api_keys: owner can read/insert/delete own.

4. Notes
- profiles.balance defaults to 0.
- profiles.role defaults to 'user'; admin is 'admin'.
- All owner columns default to auth.uid().
- Service seed data is inserted after table creation.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  balance numeric(12,2) NOT NULL DEFAULT 0,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- SERVICES (public read)
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  platform text NOT NULL DEFAULT 'Instagram',
  price_per_1000 numeric(10,4) NOT NULL DEFAULT 0,
  min_order int NOT NULL DEFAULT 10,
  max_order int NOT NULL DEFAULT 100000,
  average_time text NOT NULL DEFAULT '0-1 hours',
  description text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  link text NOT NULL,
  quantity int NOT NULL,
  charge numeric(12,4) NOT NULL DEFAULT 0,
  start_count int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_orders" ON orders;
CREATE POLICY "select_own_orders" ON orders FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_orders" ON orders;
CREATE POLICY "insert_own_orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_admin_orders" ON orders;
CREATE POLICY "update_admin_orders" ON orders FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'deposit',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- TICKETS
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text NOT NULL DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tickets" ON tickets;
CREATE POLICY "select_own_tickets" ON tickets FOR SELECT
  TO authenticated USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

DROP POLICY IF EXISTS "insert_own_tickets" ON tickets;
CREATE POLICY "insert_own_tickets" ON tickets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_admin_tickets" ON tickets;
CREATE POLICY "update_admin_tickets" ON tickets FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- TICKET REPLIES
CREATE TABLE IF NOT EXISTS ticket_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_staff boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_ticket_replies" ON ticket_replies;
CREATE POLICY "select_ticket_replies" ON ticket_replies FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM tickets WHERE tickets.id = ticket_replies.ticket_id AND (tickets.user_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')))
  );

DROP POLICY IF EXISTS "insert_ticket_replies" ON ticket_replies;
CREATE POLICY "insert_ticket_replies" ON ticket_replies FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- API KEYS
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  key_value text UNIQUE NOT NULL,
  label text NOT NULL DEFAULT 'Default',
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz
);
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_api_keys" ON api_keys;
CREATE POLICY "select_own_api_keys" ON api_keys FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_api_keys" ON api_keys;
CREATE POLICY "insert_own_api_keys" ON api_keys FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_api_keys" ON api_keys;
CREATE POLICY "delete_own_api_keys" ON api_keys FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- SEED SERVICES
INSERT INTO services (name, category, platform, price_per_1000, min_order, max_order, average_time, description) VALUES
('Instagram Followers [Real][Instant]', 'Followers', 'Instagram', 0.85, 50, 500000, '0-30 minutes', 'High-quality real Instagram followers delivered instantly to your account.'),
('Instagram Likes [Instant]', 'Likes', 'Instagram', 0.22, 10, 100000, '0-15 minutes', 'Instant Instagram likes from real-looking accounts.'),
('Instagram Views [Story + Reel]', 'Views', 'Instagram', 0.05, 100, 1000000, '0-1 hours', 'Views for Instagram stories and reels, fast delivery.'),
('Instagram Comments [Custom]', 'Comments', 'Instagram', 1.20, 5, 50000, '0-2 hours', 'Custom Instagram comments with your own text.'),
('Facebook Page Likes', 'Followers', 'Facebook', 1.45, 50, 100000, '0-6 hours', 'Real Facebook page likes to grow your audience.'),
('Facebook Post Reactions', 'Reactions', 'Facebook', 0.65, 10, 50000, '0-1 hours', 'Facebook post reactions (like, love, wow) from active users.'),
('YouTube Subscribers', 'Subscribers', 'YouTube', 3.20, 10, 50000, '0-12 hours', 'Real YouTube subscribers to grow your channel.'),
('YouTube Views [High Retention]', 'Views', 'YouTube', 0.95, 100, 1000000, '0-3 hours', 'High retention YouTube views for better ranking.'),
('YouTube Watch Hours', 'Views', 'YouTube', 5.50, 1000, 4000, '1-3 days', 'YouTube watch hours to help monetize your channel.'),
('TikTok Followers', 'Followers', 'TikTok', 0.75, 50, 200000, '0-1 hours', 'TikTok followers from real active accounts.'),
('TikTok Views', 'Views', 'TikTok', 0.02, 100, 10000000, '0-15 minutes', 'Instant TikTok views to boost your videos.'),
('TikTok Likes', 'Likes', 'TikTok', 0.18, 10, 100000, '0-30 minutes', 'TikTok likes from high-quality accounts.'),
('Twitter (X) Followers', 'Followers', 'Twitter', 1.10, 50, 100000, '0-6 hours', 'Twitter/X followers to build your presence.'),
('Twitter (X) Retweets', 'Retweets', 'Twitter', 0.80, 10, 50000, '0-2 hours', 'Twitter/X retweets to amplify your posts.'),
('Telegram Channel Members', 'Members', 'Telegram', 1.30, 100, 100000, '0-4 hours', 'Telegram channel members delivered fast.'),
('Telegram Post Views', 'Views', 'Telegram', 0.15, 100, 1000000, '0-1 hours', 'Telegram post views to increase engagement.'),
('Spotify Plays', 'Plays', 'Spotify', 0.45, 1000, 10000000, '0-12 hours', 'Spotify plays to boost your tracks and royalties.'),
('Spotify Monthly Listeners', 'Listeners', 'Spotify', 2.10, 1000, 1000000, '1-3 days', 'Spotify monthly listeners to grow your artist profile.'),
('Website Traffic [Real Visitors]', 'Traffic', 'Website', 0.30, 1000, 10000000, '0-2 hours', 'Real website traffic from global visitors to boost SEO.'),
('Backlinks [SEO]', 'SEO', 'Website', 4.00, 100, 10000, '1-7 days', 'High-quality SEO backlinks to improve your search ranking.')
ON CONFLICT DO NOTHING;
