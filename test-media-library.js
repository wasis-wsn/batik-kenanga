import { storageService, STORAGE_BUCKETS } from './src/services/storageService.js';

async function testMediaLibrary() {
  console.log('Testing Media Library functionality...');
  
  try {
    console.log('1. Checking storage availability...');
    const available = await storageService.checkBucketsAvailability();
    console.log('Storage available:', available);
    
    if (!available) {
      console.error('Storage not available, stopping test');
      return;
    }
    
    console.log('2. Testing company bucket file listing...');
    
    // Test logo files
    console.log('2a. Listing logo files...');
    try {
      const logoFiles = await storageService.listFiles(STORAGE_BUCKETS.COMPANY, 'logos');
      console.log('Logo files:', logoFiles.length, 'found');
      logoFiles.forEach(file => {
        console.log('  -', file.name, `(${file.metadata?.size || 0} bytes)`);
      });
    } catch (error) {
      console.error('Error listing logo files:', error);
    }
    
    // Test hero image files
    console.log('2b. Listing hero image files...');
    try {
      const heroFiles = await storageService.listFiles(STORAGE_BUCKETS.COMPANY, 'hero-images');
      console.log('Hero image files:', heroFiles.length, 'found');
      heroFiles.forEach(file => {
        console.log('  -', file.name, `(${file.metadata?.size || 0} bytes)`);
      });
    } catch (error) {
      console.error('Error listing hero image files:', error);
    }
    
    console.log('3. Testing combined file listing...');
    try {
      const logoFiles = await storageService.listFiles(STORAGE_BUCKETS.COMPANY, 'logos');
      const heroFiles = await storageService.listFiles(STORAGE_BUCKETS.COMPANY, 'hero-images');
      const allFiles = [...logoFiles, ...heroFiles];
      
      console.log('Total company files:', allFiles.length);
      
      const filteredFiles = allFiles
        .filter(file => 
          !file.name.includes('.emptyFolderPlaceholder') && 
          file.metadata && 
          file.metadata.size > 0
        );
        
      console.log('Filtered files (excluding placeholders):', filteredFiles.length);
      
      filteredFiles.forEach(file => {
        console.log('  -', file.name, `(${file.metadata?.size || 0} bytes)`, file.publicUrl);
      });
      
    } catch (error) {
      console.error('Error in combined listing:', error);
    }
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMediaLibrary();
