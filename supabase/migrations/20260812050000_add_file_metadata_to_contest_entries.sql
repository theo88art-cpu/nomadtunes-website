DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contest_entries' AND column_name = 'file_name'
  ) THEN
    ALTER TABLE contest_entries ADD COLUMN file_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contest_entries' AND column_name = 'file_path'
  ) THEN
    ALTER TABLE contest_entries ADD COLUMN file_path text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contest_entries' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE contest_entries ADD COLUMN file_size bigint;
  END IF;
END $$;
