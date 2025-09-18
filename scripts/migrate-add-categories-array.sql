-- Add categories array column to support multi-category beats
ALTER TABLE beats
  ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT ARRAY['latest']::TEXT[];

-- Ensure single category column stays in sync by filling the array when empty
UPDATE beats
SET categories = ARRAY[category]
WHERE (categories IS NULL OR array_length(categories, 1) = 0)
  AND category IS NOT NULL;

-- Backfill the legacy single-category column if it somehow became null
UPDATE beats
SET category = COALESCE(category, 'latest')
WHERE category IS NULL;

-- Optional: tighten constraints so categories always has at least one value
ALTER TABLE beats ALTER COLUMN categories SET NOT NULL;

-- Optional: create a GIN index for fast membership checks on the array
CREATE INDEX IF NOT EXISTS idx_beats_categories_gin ON beats USING GIN (categories);
