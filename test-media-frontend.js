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
  envVars.VITE_SUPABASE_ANON_KEY
);

async function testMediaLibraryFrontend() {
  console.log('Testing Media Library frontend functionality...');
  
  try {
    console.log('1. Testing direct file listing from company bucket...');
    
    // Test logo files
    console.log('1a. Listing logo files...');
    const { data: logoFiles, error: logoError } = await supabase.storage
      .from('company')
      .list('logos', { limit: 100 });
    
    if (logoError) {
      console.error('Error listing logo files:', logoError);
    } else {
      console.log('Logo files found:', logoFiles.length);
      logoFiles.forEach(file => {
        if (!file.name.includes('.emptyFolderPlaceholder')) {
          const { data: urlData } = supabase.storage
            .from('company')
            .getPublicUrl(`logos/${file.name}`);
          console.log('  -', file.name, `(${file.metadata?.size || 0} bytes)`, urlData.publicUrl);
        }
      });
    }
    
    console.log('1b. Listing hero image files...');
    const { data: heroFiles, error: heroError } = await supabase.storage
      .from('company')
      .list('hero-images', { limit: 100 });
    
    if (heroError) {
      console.error('Error listing hero image files:', heroError);
    } else {
      console.log('Hero image files found:', heroFiles.length);
      heroFiles.forEach(file => {
        if (!file.name.includes('.emptyFolderPlaceholder')) {
          const { data: urlData } = supabase.storage
            .from('company')
            .getPublicUrl(`hero-images/${file.name}`);
          console.log('  -', file.name, `(${file.metadata?.size || 0} bytes)`, urlData.publicUrl);
        }
      });
    }
    
    console.log('2. Simulating MediaLibraryPage logic...');
    
    const allFiles = [];
    
    // Add logo files
    if (logoFiles && !logoError) {
      const validLogoFiles = logoFiles
        .filter(file => !file.name.includes('.emptyFolderPlaceholder') && file.metadata && file.metadata.size > 0)
        .map(file => {
          const { data: urlData } = supabase.storage
            .from('company')
            .getPublicUrl(`logos/${file.name}`);
          
          return {
            ...file,
            bucket: 'company',
            fullPath: `logos/${file.name}`,
            publicUrl: urlData.publicUrl,
            type: 'image'
          };
        });
      
      allFiles.push(...validLogoFiles);
      console.log('Valid logo files added:', validLogoFiles.length);
    }
    
    // Add hero image files
    if (heroFiles && !heroError) {
      const validHeroFiles = heroFiles
        .filter(file => !file.name.includes('.emptyFolderPlaceholder') && file.metadata && file.metadata.size > 0)
        .map(file => {
          const { data: urlData } = supabase.storage
            .from('company')
            .getPublicUrl(`hero-images/${file.name}`);
          
          return {
            ...file,
            bucket: 'company',
            fullPath: `hero-images/${file.name}`,
            publicUrl: urlData.publicUrl,
            type: 'image'
          };
        });
      
      allFiles.push(...validHeroFiles);
      console.log('Valid hero image files added:', validHeroFiles.length);
    }
    
    console.log('Total files that should appear in MediaLibrary:', allFiles.length);
    console.log('Files:');
    allFiles.forEach(file => {
      console.log('  -', file.name, file.fullPath, `(${file.metadata?.size || 0} bytes)`);
    });
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMediaLibraryFrontend();
