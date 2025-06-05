-- Fix RLS policies for company_info to allow public updates
-- This is needed for the logo upload functionality to work

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admin company info update" ON company_info;

-- Create a more permissive policy for company info updates
CREATE POLICY "Public company info update" ON company_info
  FOR UPDATE USING (true);
  
-- Also allow insert for company info if needed
DROP POLICY IF EXISTS "Public company info insert" ON company_info;
CREATE POLICY "Public company info insert" ON company_info
  FOR INSERT WITH CHECK (true);
