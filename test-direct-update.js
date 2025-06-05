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

async function testDirectUpdate() {
  console.log('Testing direct update without .single()...');
  
  try {
    // Get the existing record first
    const { data: existingData, error: selectError } = await supabase
      .from('company_info')
      .select('id, logo_url_light')
      .limit(1);
      
    if (selectError) {
      console.error('Error selecting:', selectError);
      return;
    }
    
    if (!existingData || existingData.length === 0) {
      console.error('No company info found');
      return;
    }
    
    const recordId = existingData[0].id;
    console.log('Found record with ID:', recordId);
    console.log('Current logo URL:', existingData[0].logo_url_light);
    
    // Test update without .single()
    const testUrl = `https://xvkkhitssnzexoaumaua.supabase.co/storage/v1/object/public/company/logos/${Date.now()}-test-logo.jpg`;
    
    const { data: updateData, error: updateError } = await supabase
      .from('company_info')
      .update({ logo_url_light: testUrl })
      .eq('id', recordId)
      .select();
    
    if (updateError) {
      console.error('Error updating:', updateError);
    } else {
      console.log('Update successful!');
      console.log('Updated records:', updateData.length);
      console.log('Updated data:', JSON.stringify(updateData, null, 2));
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testDirectUpdate();
