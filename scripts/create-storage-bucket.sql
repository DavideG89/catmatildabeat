-- Create storage bucket for beat covers
INSERT INTO storage.buckets (id, name, public) VALUES ('beat-covers', 'beat-covers', true);

-- Create policy to allow public access to beat covers
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'beat-covers');

-- Create policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'beat-covers' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their uploads
CREATE POLICY "Users can update own uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'beat-covers' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete their uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects FOR DELETE USING (bucket_id = 'beat-covers' AND auth.role() = 'authenticated');
