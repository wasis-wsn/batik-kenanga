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

// Use service role key for admin operations (bypasses RLS)
const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function testFullUploadFlow() {
  console.log('Testing complete upload flow with service role key...');
  
  try {
    console.log('1. Getting current company info...');
    const { data: currentData, error: selectError } = await supabase
      .from('company_info')
      .select('id, logo_url_light, hero_image');
    
    if (selectError) {
      console.error('Error selecting:', selectError);
      return;
    }
    
    if (!currentData || currentData.length === 0) {
      console.error('No company info found');
      return;
    }
    
    const record = currentData[0];
    console.log('Current record:', {
      id: record.id,
      logo_url_light: record.logo_url_light,
      hero_image: record.hero_image
    });
    
    console.log('2. Testing logo URL update...');
    const newLogoUrl = `https://xvkkhitssnzexoaumaua.supabase.co/storage/v1/object/public/company/logos/${Date.now()}-test-logo.jpg`;
    
    const { data: updateData, error: updateError } = await supabase
      .from('company_info')
      .update({ logo_url_light: newLogoUrl })
      .eq('id', record.id)
      .select();
    
    if (updateError) {
      console.error('Error updating with service role:', updateError);
    } else {
      console.log('✅ Update successful with service role!');
      console.log('Updated data:', updateData[0]);
      
      console.log('3. Testing hero image update...');
      const newHeroUrl = `https://xvkkhitssnzexoaumaua.supabase.co/storage/v1/object/public/company/hero-images/${Date.now()}-test-hero.jpg`;
      
      const { data: heroUpdateData, error: heroUpdateError } = await supabase
        .from('company_info')
        .update({ hero_image: newHeroUrl })
        .eq('id', record.id)
        .select();
      
      if (heroUpdateError) {
        console.error('Error updating hero image:', heroUpdateError);
      } else {
        console.log('✅ Hero image update successful!');
        console.log('Updated hero image:', heroUpdateData[0].hero_image);
      }
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testFullUploadFlow();
