import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkStorage() {
  console.log('Checking company bucket contents...');
  
  try {
    // List all files in company bucket
    const { data: files, error } = await supabase.storage
      .from('company')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
    
    if (error) {
      console.error('Error listing files:', error);
      return;
    }
    
    console.log('Files in company bucket root:', JSON.stringify(files, null, 2));
    
    // Check logos folder
    const { data: logoFiles, error: logoError } = await supabase.storage
      .from('company')
      .list('logos', { limit: 100 });
    
    if (logoError) {
      console.error('Error listing logo files:', logoError);
    } else {
      console.log('Files in logos folder:', JSON.stringify(logoFiles, null, 2));
    }
    
    // Check hero-images folder
    const { data: heroFiles, error: heroError } = await supabase.storage
      .from('company')
      .list('hero-images', { limit: 100 });
    
    if (heroError) {
      console.error('Error listing hero image files:', heroError);
    } else {
      console.log('Files in hero-images folder:', JSON.stringify(heroFiles, null, 2));
    }
    
  } catch (error) {
    console.error('Storage check failed:', error);
  }
}

checkStorage();
