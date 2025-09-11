-- Add the category column to existing beats table
ALTER TABLE beats ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'latest' CHECK (category IN ('trending', 'featured', 'new_releases', 'latest'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_beats_category ON beats(category);

-- Update existing beats to have categories (if any exist)
UPDATE beats SET category = 'latest' WHERE category IS NULL;
