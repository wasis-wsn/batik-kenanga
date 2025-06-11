-- Media Library Table Setup untuk Supabase
-- Jalankan script ini di Supabase SQL Editor

-- 1. Pastikan tabel media_library ada dengan struktur yang benar
CREATE TABLE IF NOT EXISTS public.media_library (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  url text NOT NULL,
  file_size integer,
  mime_type text,
  file_type text,
  bucket_name text NOT NULL,
  category text DEFAULT 'general',
  alt_text text,
  caption text,
  tags text[] DEFAULT '{}',
  created_by uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;

-- 3. Create or replace function untuk update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger untuk updated_at
DROP TRIGGER IF EXISTS update_media_library_updated_at ON public.media_library;
CREATE TRIGGER update_media_library_updated_at 
    BEFORE UPDATE ON public.media_library 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();

-- 5. Create policies untuk akses
DROP POLICY IF EXISTS "Public read access on media_library" ON public.media_library;
CREATE POLICY "Public read access on media_library" 
    ON public.media_library FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage media_library" ON public.media_library;
CREATE POLICY "Authenticated users can manage media_library" 
    ON public.media_library FOR ALL 
    USING (true);

-- 6. Create indexes untuk performance
CREATE INDEX IF NOT EXISTS idx_media_library_bucket_name ON public.media_library(bucket_name);
CREATE INDEX IF NOT EXISTS idx_media_library_category ON public.media_library(category);
CREATE INDEX IF NOT EXISTS idx_media_library_file_type ON public.media_library(file_type);
CREATE INDEX IF NOT EXISTS idx_media_library_created_at ON public.media_library(created_at DESC);

-- 7. Grant permissions
GRANT ALL ON public.media_library TO postgres;
GRANT ALL ON public.media_library TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_library TO authenticated;
GRANT SELECT ON public.media_library TO anon;

-- Test query untuk memastikan tabel berfungsi
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'media_library' 
AND table_schema = 'public'
ORDER BY ordinal_position;
