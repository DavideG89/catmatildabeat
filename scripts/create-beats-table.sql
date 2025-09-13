-- Drop existing table if it exists
DROP TABLE IF EXISTS beats CASCADE;

-- Create beats table with all required columns
CREATE TABLE beats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  producer TEXT NOT NULL DEFAULT 'Cat Matilda Beat',
  cover_image TEXT,
  bpm INTEGER NOT NULL CHECK (bpm > 0 AND bpm <= 300),
  key TEXT NOT NULL,
  genre TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  category TEXT NOT NULL DEFAULT 'latest' CHECK (category IN ('trending', 'featured', 'new_releases', 'latest')),
  beatstars_link TEXT,
  sales INTEGER DEFAULT 0,
  description TEXT,
  duration TEXT DEFAULT '3:30',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_beats_status ON beats(status);
CREATE INDEX idx_beats_category ON beats(category);
CREATE INDEX idx_beats_genre ON beats(genre);
CREATE INDEX idx_beats_created_at ON beats(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on beats" ON beats FOR ALL USING (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE beats;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_beats_updated_at BEFORE UPDATE ON beats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

