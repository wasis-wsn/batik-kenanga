-- Update news table to match the admin panel expectations
-- Add status column and update structure
ALTER TABLE public.news 
  DROP COLUMN IF EXISTS published,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  ADD COLUMN IF NOT EXISTS meta_title text,
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Update the published policy to use status instead
DROP POLICY IF EXISTS "Allow public read access on published news" ON public.news;
CREATE POLICY "Allow public read access on published news" ON public.news FOR SELECT USING (status = 'published');
