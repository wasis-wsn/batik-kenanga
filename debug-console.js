// Copy and paste this into your browser console on the admin page

async function debugStorageIssue() {
  console.log('🚀 Starting storage debug...');
  
  try {
    // Import the storage service
    const { storageService } = await import('./src/services/storageService.js');
    
    console.log('✅ Storage service imported');
    
    // Test 1: Simple bucket check
    console.log('\n=== Test 1: Simple Bucket Check ===');
    const result = await storageService.simpleBucketCheck();
    console.log('Result:', result);
    
    // Test 2: Try test upload if buckets are available
    if (result.success && result.buckets.length > 0) {
      console.log('\n=== Test 2: Test Upload ===');
      const uploadResult = await storageService.testUpload('images');
      console.log('Upload result:', uploadResult);
    }
    
    console.log('\n✅ Debug complete!');
    
  } catch (error) {
    console.error('💥 Debug failed:', error);
  }
}

// Run the debug
debugStorageIssue();
