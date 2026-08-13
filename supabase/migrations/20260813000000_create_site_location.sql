-- Create site_location table for footer location
CREATE TABLE IF NOT EXISTS site_location (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  country text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_location ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_location" ON site_location;
CREATE POLICY "anon_select_site_location" ON site_location
  FOR SELECT
  TO anon
  USING (true);
