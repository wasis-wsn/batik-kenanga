-- Add missing columns to media_library table
-- Run this in Supabase SQL Editor

-- Add missing updated_at trigger for media_library
CREATE TRIGGER update_media_library_updated_at 
  BEFORE UPDATE ON public.media_library 
  FOR EACH ROW 
  EXECUTE PROCEDURE update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_library_bucket_name ON public.media_library(bucket_name);
CREATE INDEX IF NOT EXISTS idx_media_library_category ON public.media_library(category);
CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON public.media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON public.media_library(created_at);

-- Grant necessary permissions
GRANT ALL ON public.media_library TO postgres;
GRANT ALL ON public.media_library TO service_role;
GRANT SELECT ON public.media_library TO anon;
GRANT SELECT ON public.media_library TO authenticated;

-- Create admin policies for media_library
DROP POLICY IF EXISTS "Admin can manage media_library" ON public.media_library;
CREATE POLICY "Admin can manage media_library" ON public.media_library
  FOR ALL USING (true);

-- Allow authenticated users to insert/update media files
DROP POLICY IF EXISTS "Authenticated can insert media" ON public.media_library;
CREATE POLICY "Authenticated can insert media" ON public.media_library
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update media" ON public.media_library;
CREATE POLICY "Authenticated can update media" ON public.media_library
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Authenticated can delete media" ON public.media_library;
CREATE POLICY "Authenticated can delete media" ON public.media_library
  FOR DELETE USING (true);
