-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the beats table with proper structure
CREATE TABLE IF NOT EXISTS beats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  producer TEXT NOT NULL DEFAULT 'Cat Matilda Beat',
  cover_image TEXT DEFAULT '/placeholder.svg?height=400&width=400',
  price DECIMAL(10,2) NOT NULL DEFAULT 29.99,
  bpm INTEGER NOT NULL,
  key TEXT NOT NULL,
  genre TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
  beatstars_link TEXT,
  sales INTEGER DEFAULT 0,
  description TEXT,
  duration TEXT DEFAULT '3:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beats_status ON beats(status);
CREATE INDEX IF NOT EXISTS idx_beats_genre ON beats(genre);
CREATE INDEX IF NOT EXISTS idx_beats_bpm ON beats(bpm);
CREATE INDEX IF NOT EXISTS idx_beats_price ON beats(price);
CREATE INDEX IF NOT EXISTS idx_beats_created_at ON beats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_beats_title_search ON beats USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_beats_tags ON beats USING gin(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (you can restrict this later with authentication)
DROP POLICY IF EXISTS "Allow all operations on beats" ON beats;
CREATE POLICY "Allow all operations on beats" ON beats
  FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_beats_updated_at ON beats;
CREATE TRIGGER update_beats_updated_at 
    BEFORE UPDATE ON beats 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable real-time for the beats table
ALTER PUBLICATION supabase_realtime ADD TABLE beats;
