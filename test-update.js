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

async function testUpdate() {
  console.log('Testing company_info update...');
  
  try {
    // First get the existing record
    console.log('1. Getting existing record...');
    const { data: existingData, error: selectError } = await supabase
      .from('company_info')
      .select('id')
      .limit(1)
      .single();
      
    if (selectError) {
      console.error('Error selecting:', selectError);
      return;
    }
    
    console.log('2. Found record with ID:', existingData.id);
    
    // Test update with logo URL
    console.log('3. Testing update...');
    const testUrl = 'https://xvkkhitssnzexoaumaua.supabase.co/storage/v1/object/public/company/logos/test-logo.jpg';
    
    const { data: updateData, error: updateError } = await supabase
      .from('company_info')
      .update({ logo_url_light: testUrl })
      .eq('id', existingData.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating:', updateError);
    } else {
      console.log('4. Update successful!');
      console.log('Updated data:', JSON.stringify(updateData, null, 2));
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testUpdate();
