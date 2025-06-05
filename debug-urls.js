// Debugging function for URL construction
// Copy and paste this in your browser console to test URL generation

async function testUrlGeneration() {
  console.log('🔧 Testing URL generation...');
  
  // Import the storage service
  const { storageService } = await import('./src/services/storageService.js');
  
  // Test different file paths
  const testCases = [
    { bucket: 'images', path: 'test-file.jpg' },
    { bucket: 'images', path: '/test-file.jpg' },
    { bucket: 'images', path: '//test-file.jpg' },
    { bucket: 'images', path: 'folder/test-file.jpg' },
    { bucket: 'documents', path: 'document.pdf' }
  ];
  
  console.log('Test cases:');
  testCases.forEach((test, index) => {
    const url = storageService.getPublicUrl(test.bucket, test.path);
    console.log(`${index + 1}. Bucket: ${test.bucket}, Path: "${test.path}"`);
    console.log(`   Generated URL: ${url}`);
    console.log('');
  });
  
  // Test listing files (if buckets exist)
  try {
    console.log('🗂️ Testing file listing...');
    const files = await storageService.listFiles('images');
    console.log(`Found ${files.length} files in images bucket:`);
    files.slice(0, 3).forEach(file => {
      console.log(`- ${file.name}`);
      console.log(`  URL: ${file.publicUrl}`);
    });
  } catch (error) {
    console.log('Could not list files:', error.message);
  }
}

// Run the test
testUrlGeneration();
