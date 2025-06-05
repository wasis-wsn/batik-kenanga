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

async function testNewUpdateMethod() {
  console.log('Testing new update method...');
  
  try {
    const testUrl = `https://xvkkhitssnzexoaumaua.supabase.co/storage/v1/object/public/company/logos/${Date.now()}-new-logo.jpg`;
    
    // Use the same method as in the updated supabaseService
    const { data, error } = await supabase
      .from('company_info')
      .update({ logo_url_light: testUrl })
      .neq('id', '00000000-0000-0000-0000-000000000000') // This will match all records
      .select();
    
    if (error) {
      console.error('Update error:', error);
    } else {
      console.log('Update successful!');
      console.log('Updated records:', data.length);
      if (data.length > 0) {
        console.log('Updated logo URL:', data[0].logo_url_light);
      }
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testNewUpdateMethod();
