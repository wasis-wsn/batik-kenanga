import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables from .env file
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

// Use service role key for admin operations
const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_SERVICE_ROLE_KEY // This bypasses RLS
);

async function fixRLSForCompanyInfo() {
  console.log('Fixing RLS policies for company_info table...');
  
  try {
    // Add a policy that allows public updates to company_info
    // This is needed for the logo upload functionality
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        -- Drop existing restrictive policy
        DROP POLICY IF EXISTS "Admin company info update" ON company_info;
        
        -- Create a more permissive policy for company info updates
        CREATE POLICY "Public company info update" ON company_info
          FOR UPDATE USING (true);
          
        -- Also allow insert for company info
        CREATE POLICY "Public company info insert" ON company_info
          FOR INSERT WITH CHECK (true);
      `
    });
    
    if (error) {
      console.error('Error fixing RLS:', error);
    } else {
      console.log('RLS policies updated successfully!');
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

fixRLSForCompanyInfo();
