#!/usr/bin/env node
/**
 * Admin User Setup Script for Batik Kenanga
 * 
 * This script provides instructions and utilities for setting up admin users
 * in the Supabase backend for the Batik Kenanga admin panel.
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🏪 Batik Kenanga Admin Setup');
console.log('=============================\n');

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable');
  console.log('\n📋 Setup Instructions:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add your Supabase project URL:');
  console.log('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\n🔗 Get these values from: https://supabase.com/dashboard/project/[your-project]/settings/api');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.log('⚠️  No service role key found. Using manual setup instructions.\n');
  
  console.log('📋 Manual Admin User Setup:');
  console.log('==========================');
  console.log('1. Go to your Supabase Dashboard:');
  console.log(`   ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/').replace('.supabase.co', '')}/auth/users`);
  console.log('\n2. Click "Add user" button');
  console.log('\n3. Fill in the form:');
  console.log('   • Email: admin@batikkenanga.com (or your preferred admin email)');
  console.log('   • Password: Create a strong password');
  console.log('   • Email Confirm: ✅ Check this box');
  console.log('   • Phone Confirm: Leave unchecked');
  console.log('\n4. Click "Create user"');
  console.log('\n5. After user is created, go to SQL Editor and run:');
  console.log(`
  -- Add admin role to user
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'), 
    '{role}', 
    '"admin"'
  )
  WHERE email = 'admin@batikkenanga.com';

  -- Insert user profile (if you have a profiles table)
  INSERT INTO profiles (id, email, role, created_at, updated_at)
  VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@batikkenanga.com'),
    'admin@batikkenanga.com',
    'admin',
    NOW(),
    NOW()
  ) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();
  `);
  
  console.log('\n6. Save your admin credentials securely');
  console.log('\n✅ You can now login to the admin panel at:');
  console.log('   http://localhost:5173/admin/login');
  
} else {
  // If service role key is available, provide automated setup
  console.log('🔧 Automated admin setup available with service role key');
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  const createAdminUser = async (email, password) => {
    try {
      console.log(`Creating admin user: ${email}`);
      
      const { data: user, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'admin'
        }
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      console.log('✅ Admin user created successfully');
      console.log(`   Email: ${email}`);
      console.log(`   User ID: ${user.user.id}`);
      
      return user;
    } catch (error) {
      console.error('❌ Error creating admin user:', error.message);
      throw error;
    }
  };
  
  // Example usage
  console.log('\n🚀 To create an admin user programmatically:');
  console.log('   node scripts/setup-admin.js create admin@batikkenanga.com your-password');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args[0] === 'create' && args[1] && args[2] && supabaseServiceKey) {
  const [, email, password] = args;
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  createAdminUser(email, password)
    .then(() => {
      console.log('\n✅ Admin setup completed successfully!');
      console.log('🔗 Login at: http://localhost:5173/admin/login');
    })
    .catch(() => {
      process.exit(1);
    });
} else if (args[0] === 'create') {
  console.log('❌ Usage: node scripts/setup-admin.js create <email> <password>');
  console.log('⚠️  Service role key required for automated setup');
}
