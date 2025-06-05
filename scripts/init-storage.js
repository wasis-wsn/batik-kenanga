// Initialize Supabase storage buckets
import { storageService } from '../src/services/storageService.js';

console.log('Initializing Supabase storage buckets...');

try {
  await storageService.initializeBuckets();
  console.log('✅ Storage buckets initialized successfully!');
  console.log('Available buckets:');
  console.log('- images: For company images and general photos');  console.log('- documents: For PDF and document files');
  console.log('- products: For product-related images');
  console.log('- company: For company-specific media assets');
} catch (error) {
  console.error('❌ Error initializing storage buckets:', error);
}

process.exit(0);
