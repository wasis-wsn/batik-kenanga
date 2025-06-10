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

async function seedSampleData() {
  console.log('Seeding sample data...');
  
  try {
    // Insert sample colors
    console.log('Inserting colors...');
    const colors = ['Biru', 'Merah', 'Hijau', 'Orange', 'Pink', 'Kuning', 'Ungu', 'Hitam', 'Putih'];
    for (const color of colors) {
      const { error } = await supabase
        .from('colors')
        .insert([{ name: color }]);
      if (error && !error.message.includes('duplicate')) {
        console.error('Error inserting color:', error);
      }
    }

    // Insert sample cap patterns
    console.log('Inserting cap patterns...');
    const capPatterns = ['Motif Budaya', 'Motif Flora', 'Motif Fauna', 'Motif Abstrak', 'Motif Geometris', 'Motif Kenanga'];
    for (const pattern of capPatterns) {
      const { error } = await supabase
        .from('cap_patterns')
        .insert([{ name: pattern }]);
      if (error && !error.message.includes('duplicate')) {
        console.error('Error inserting cap pattern:', error);
      }
    }

    // Insert sample tiedye patterns
    console.log('Inserting tiedye patterns...');
    const tiedyePatterns = ['Serat Kayu', 'Kelereng', 'Kerut', 'Spiral', 'Gradasi', 'Tie-dye Traditional'];
    for (const pattern of tiedyePatterns) {
      const { error } = await supabase
        .from('tiedye_patterns')
        .insert([{ name: pattern }]);
      if (error && !error.message.includes('duplicate')) {
        console.error('Error inserting tiedye pattern:', error);
      }
    }

    // Insert sample categories
    console.log('Inserting categories...');
    const categories = [
      {
        slug: 'batik-kenanga-collection',
        name: 'Koleksi Batik Kenanga',
        description: 'Pilihan batik eksklusif dengan motif khas Batik Kenanga dengan satu warna dan satu motif cap.',
        image_url: 'images/category/0/category1.jpg'
      },
      {
        slug: 'custom-color',
        name: 'Koleksi Warna Custom',
        description: 'Wujudkan identitas unik Anda dengan batik yang menggunakan lebih dari satu warna.',
        image_url: 'images/category/1/category2.jpg'
      },
      {
        slug: 'custom-design',
        name: 'Custom Mix Design',
        description: 'Kombinasikan berbagai motif, warna, dan teknik untuk menciptakan batik yang benar-benar personal dan eksklusif.',
        image_url: 'images/category/2/category3.jpg'
      }
    ];

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .insert([category]);
      if (error && !error.message.includes('duplicate')) {
        console.error('Error inserting category:', error);
      }
    }

    console.log('Sample data seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}

seedSampleData();
