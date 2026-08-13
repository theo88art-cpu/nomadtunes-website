/*
# Add phone column to contest_entries

1. Modified Tables
- `contest_entries`
  - Add `phone` (text, NOT NULL) — contestant's phone number, mandatory.
2. Security
- No policy changes. Existing INSERT policy `anon_insert_contest` already allows anon + authenticated inserts with WITH CHECK (true), so the new column is covered.
3. Notes
- The column is NOT NULL to enforce that a phone number is always provided.
- Idempotent: uses DO $$ ... IF NOT EXISTS ... END $$ so re-running is safe.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contest_entries' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contest_entries ADD COLUMN phone text NOT NULL DEFAULT '';
  END IF;
END $$;
