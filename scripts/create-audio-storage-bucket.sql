-- Create storage bucket for beat audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('beat-audio', 'beat-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the beat-audio bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'beat-audio');
CREATE POLICY "Authenticated users can upload audio files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'beat-audio' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own audio files" ON storage.objects FOR UPDATE USING (bucket_id = 'beat-audio' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete own audio files" ON storage.objects FOR DELETE USING (bucket_id = 'beat-audio' AND auth.role() = 'authenticated');
