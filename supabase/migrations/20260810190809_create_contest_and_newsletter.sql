/*
# Create contest_entries and newsletter_subscribers tables (single-tenant, no auth)

1. New Tables
- `contest_entries`
  - `id` (uuid, primary key)
  - `instagram` (text, not null) — artist's Instagram handle
  - `email` (text, not null) — artist's email
  - `country` (text, not null) — artist's country
  - `song_url` (text) — optional link to uploaded song
  - `accepted_terms` (boolean, not null, default false)
  - `created_at` (timestamptz, default now())
- `newsletter_subscribers`
  - `id` (uuid, primary key)
  - `email` (text, unique, not null)
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on both tables.
- Allow anon + authenticated INSERT only (public contest/newsletter signup, no reads from the client).
*/

CREATE TABLE IF NOT EXISTS contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram text NOT NULL,
  email text NOT NULL,
  country text NOT NULL,
  song_url text,
  accepted_terms boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contest_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contest" ON contest_entries;
CREATE POLICY "anon_insert_contest" ON contest_entries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);
