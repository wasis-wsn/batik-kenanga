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

async function checkCompanyInfo() {
  console.log('Checking company_info table...');
  
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Company info records found:', data.length);
      if (data.length > 0) {
        console.log('Data:', JSON.stringify(data, null, 2));
      } else {
        console.log('No records found in company_info table');
      }
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkCompanyInfo();
