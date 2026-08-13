-- Add latitude and longitude columns to site_location
ALTER TABLE IF EXISTS site_location
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;
