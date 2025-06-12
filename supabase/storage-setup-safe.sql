-- Alternative Storage Setup - Safe Bucket Creation
-- Run this in Supabase SQL Editor if you're getting RLS errors

-- Step 1: Disable RLS on buckets table temporarily (admin only)
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Step 2: Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('company', 'company', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Step 3: Re-enable RLS on buckets with permissive policy
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Allow all operations on buckets (you can make this more restrictive later)
CREATE POLICY "Allow bucket operations" ON storage.buckets
FOR ALL USING (true);

-- Step 4: Set up object policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to all objects
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (true);

-- Policy to allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy to allow authenticated users to update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy to allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- Step 5: Verify buckets were created
SELECT id, name, public, file_size_limit FROM storage.buckets;
