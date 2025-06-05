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

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function testRLSPolicies() {
  console.log('Testing RLS policies...');
  
  try {
    // Test 1: Check if RLS is enabled
    console.log('\n1. Checking RLS status...');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE tablename = 'company_info';
      `
    });
    
    if (!rlsError && rlsStatus) {
      console.log('RLS Status:', rlsStatus);
    }
    
    // Test 2: Check current policies
    console.log('\n2. Checking current policies...');
    const { data: policies, error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT policyname, cmd, qual, with_check 
        FROM pg_policies 
        WHERE tablename = 'company_info';
      `
    });
    
    if (!policiesError && policies) {
      console.log('Current policies:', policies);
    }
    
    // Test 3: Try to update without WHERE clause (should work with public policy)
    console.log('\n3. Testing update without WHERE clause...');
    const testUrl = `https://test-url-${Date.now()}.jpg`;
    const { data: updateData, error: updateError } = await supabase
      .from('company_info')
      .update({ logo_url_light: testUrl })
      .select();
    
    if (updateError) {
      console.error('Update error:', updateError);
    } else {
      console.log('Update success:', updateData);
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testRLSPolicies();
