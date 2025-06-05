// Debug Storage Connection
// Run this in browser console on your admin page

import { storageService } from '../services/storageService.js';

console.log('🚀 Starting storage debug session...');

// Test 1: Debug bucket access
async function testBucketAccess() {
  console.log('\n=== TEST 1: Bucket Access ===');
  await storageService.debugBucketAccess();
}

// Test 2: Test individual bucket access
async function testIndividualBuckets() {
  console.log('\n=== TEST 2: Individual Bucket Access ===');
  
  const buckets = ['images', 'documents', 'products', 'company'];
  
  for (const bucketName of buckets) {
    try {
      console.log(`\n📦 Testing bucket: ${bucketName}`);
      
      // Try to list files in the bucket
      const { data: files, error } = await storageService.storage
        .from(bucketName)
        .list('', { limit: 1 });
      
      if (error) {
        console.error(`❌ ${bucketName}: ${error.message}`);
      } else {
        console.log(`✅ ${bucketName}: Access OK (${files.length} files)`);
      }
    } catch (error) {
      console.error(`💥 ${bucketName}: Unexpected error:`, error);
    }
  }
}

// Test 3: Test Supabase client configuration
async function testSupabaseConfig() {
  console.log('\n=== TEST 3: Supabase Configuration ===');
  
  // Import supabase client
  const { supabase } = await import('../services/supabase.js');
  
  console.log('📋 Supabase Config:');
  console.log('- URL:', supabase.supabaseUrl);
  console.log('- Key starts with:', supabase.supabaseKey?.substring(0, 20) + '...');
  
  // Test basic connection
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('🔐 Auth status:', error ? 'Error' : 'Connected');
    if (error) console.log('Auth error:', error.message);
  } catch (error) {
    console.error('💥 Auth connection failed:', error);
  }
}

// Run all tests
async function runAllTests() {
  try {
    await testSupabaseConfig();
    await testBucketAccess();
    await testIndividualBuckets();
    
    console.log('\n🎯 DEBUGGING COMPLETE');
    console.log('Check the results above to identify the issue.');
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
  }
}

// Auto-run when loaded
console.log('📝 To run debug tests, call: runAllTests()');
console.log('📝 Or run individual tests: testBucketAccess(), testIndividualBuckets(), testSupabaseConfig()');

// Export for manual use
window.debugStorage = {
  runAllTests,
  testBucketAccess,
  testIndividualBuckets,
  testSupabaseConfig,
  storageService
};

// Auto-run after 1 second
setTimeout(runAllTests, 1000);
