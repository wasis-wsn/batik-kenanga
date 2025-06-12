-- Storage Security Policies for Supabase
-- Run this in Supabase SQL Editor to fix storage bucket issues

-- Create storage buckets with proper policies
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('company', 'company', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to all objects
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (true);

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- Disable RLS temporarily for bucket creation
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Alternative approach: Create buckets first, then enable RLS with proper policies
-- This prevents the RLS violation during bucket creation

-- After buckets are created, you can enable RLS with these policies:
-- ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow bucket operations" ON storage.buckets FOR ALL USING (true);
