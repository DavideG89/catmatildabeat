-- Add audio_file column to beats table
ALTER TABLE beats ADD COLUMN IF NOT EXISTS audio_file TEXT;

-- Add comment to the column
COMMENT ON COLUMN beats.audio_file IS 'URL to the uploaded audio file (MP3/WAV)';
