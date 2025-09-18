-- Legacy migration: single category column (kept for reference only)
ALTER TABLE beats
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'latest'
  CHECK (category IN ('trending', 'featured', 'new_releases', 'latest'));

CREATE INDEX IF NOT EXISTS idx_beats_category ON beats(category);

UPDATE beats
SET category = 'latest'
WHERE category IS NULL;
