-- STORAGE FIX SQL SCRIPT
-- Copy dan paste ini ke Supabase SQL Editor

-- Step 1: Disable RLS temporarily untuk bucket creation
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Step 2: Pastikan buckets ada (create if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('images', 'images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('documents', 'documents', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('products', 'products', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('company', 'company', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Step 3: Re-enable RLS dengan policy yang benar
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Policy untuk allow bucket operations
DROP POLICY IF EXISTS "Allow bucket operations" ON storage.buckets;
CREATE POLICY "Allow bucket operations" ON storage.buckets
FOR ALL USING (true);

-- Step 4: Setup object policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (true);

-- Step 5: Verify setup
SELECT 'Buckets created:' as status;
SELECT id, name, public, file_size_limit FROM storage.buckets 
WHERE id IN ('images', 'documents', 'products', 'company');

SELECT 'Script completed successfully!' as result;
