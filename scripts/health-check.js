#!/usr/bin/env node
/**
 * Batik Kenanga Application Health Check & Setup
 * 
 * This script checks the application setup and provides guidance
 * for completing the admin panel configuration.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🏪 Batik Kenanga Setup Check');
console.log('============================\n');

const checkFile = (path, description) => {
  if (existsSync(path)) {
    console.log(`✅ ${description}: Found`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    return false;
  }
};

const checkEnvironment = () => {
  console.log('📋 Environment Configuration:');
  
  const envExists = checkFile('.env', 'Environment file');
  const envExampleExists = checkFile('.env.example', 'Environment template');
  
  if (!envExists && envExampleExists) {
    console.log('   💡 Copy .env.example to .env and configure your Supabase credentials');
  }
  
  if (envExists) {
    try {
      const envContent = readFileSync('.env', 'utf8');
      const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('your-project-ref');
      const hasAnonKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('your-anon-key');
      
      if (hasSupabaseUrl && hasAnonKey) {
        console.log('   ✅ Supabase configuration appears complete');
      } else {
        console.log('   ⚠️  Supabase configuration incomplete');
        console.log('      Please update your .env file with valid Supabase credentials');
      }
    } catch (error) {
      console.log('   ❌ Error reading .env file');
    }
  }
  
  console.log('');
};

const checkDependencies = async () => {
  console.log('📦 Dependencies Check:');
  
  const packageJsonExists = checkFile('package.json', 'Package configuration');
  const nodeModulesExists = checkFile('node_modules', 'Node modules');
  
  if (packageJsonExists && !nodeModulesExists) {
    console.log('   💡 Run: npm install');
  }
  
  if (packageJsonExists) {
    try {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
      const requiredDeps = [
        '@supabase/supabase-js',
        'react-router-dom',
        '@radix-ui/react-toast',
        '@uiw/react-md-editor'
      ];
      
      let missingDeps = [];
      requiredDeps.forEach(dep => {
        if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
          missingDeps.push(dep);
        }
      });
      
      if (missingDeps.length === 0) {
        console.log('   ✅ All required dependencies present');
      } else {
        console.log('   ⚠️  Missing dependencies:', missingDeps.join(', '));
      }
    } catch (error) {
      console.log('   ❌ Error reading package.json');
    }
  }
  
  console.log('');
};

const checkApplicationStructure = () => {
  console.log('🏗️  Application Structure:');
  
  const criticalFiles = [
    ['src/App.jsx', 'Main application component'],
    ['src/components/admin/AdminLayout.jsx', 'Admin layout'],
    ['src/contexts/AdminAuthContext.jsx', 'Admin authentication'],
    ['src/services/supabase.js', 'Supabase service'],
    ['src/pages/admin/AdminLoginPage.jsx', 'Admin login page'],
    ['src/pages/admin/AdminDashboardPage.jsx', 'Admin dashboard']
  ];
  
  let allPresent = true;
  criticalFiles.forEach(([path, description]) => {
    if (!checkFile(path, description)) {
      allPresent = false;
    }
  });
  
  if (allPresent) {
    console.log('   ✅ Core application structure complete');
  } else {
    console.log('   ⚠️  Some critical files are missing');
  }
  
  console.log('');
};

const checkSupabaseSetup = () => {
  console.log('🗄️  Database Setup:');
  console.log('   📋 Required Supabase tables:');
  console.log('      • categories (product categories)');
  console.log('      • products (product catalog)');
  console.log('      • news (news articles)');
  console.log('      • testimonials (customer reviews)');
  console.log('      • company_info (company settings)');
  console.log('      • profiles (user profiles)');
  
  console.log('\n   🔐 Authentication setup:');
  console.log('      • Admin user with role="admin"');
  console.log('      • Row Level Security (RLS) policies');
  
  console.log('\n   💡 Setup instructions:');
  console.log('      1. Run SQL migrations in Supabase Dashboard > SQL Editor');
  console.log('      2. Create admin user: node scripts/setup-admin.js');
  console.log('      3. Configure RLS policies for security');
  
  console.log('');
};

const provideNextSteps = () => {
  console.log('🚀 Next Steps:');
  console.log('==============');
  
  if (!existsSync('.env')) {
    console.log('1. 📋 Copy .env.example to .env');
    console.log('2. 🔧 Configure Supabase credentials in .env');
  }
  
  if (!existsSync('node_modules')) {
    console.log('3. 📦 Install dependencies: npm install');
  }
  
  console.log('4. 🗄️  Setup Supabase database schema');
  console.log('5. 👤 Create admin user: node scripts/setup-admin.js');
  console.log('6. 🚀 Start development server: npm run dev');
  console.log('7. 🔗 Access admin panel: http://localhost:5173/admin/login');
  
  console.log('\n📚 Documentation:');
  console.log('   • docs/ADMIN_PANEL.md - Complete admin panel guide');
  console.log('   • docs/QUICK_START.md - Quick setup instructions');
  
  console.log('\n🎯 Current Status:');
  if (existsSync('.env') && existsSync('node_modules')) {
    console.log('   ✅ Ready for database setup and admin user creation');
  } else {
    console.log('   ⏳ Environment and dependencies need configuration');
  }
};

// Run all checks
const runChecks = async () => {
  checkEnvironment();
  await checkDependencies();
  checkApplicationStructure();
  checkSupabaseSetup();
  provideNextSteps();
};

runChecks().catch(console.error);
