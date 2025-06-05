#!/usr/bin/env node
/**
 * Batik Kenanga Complete Setup Script
 * This script automates the setup process for the Batik Kenanga project
 */

import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createInterface } from 'readline';

const execAsync = promisify(exec);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🏪 Batik Kenanga Complete Setup');
console.log('================================\n');

const steps = {
  async checkEnvironment() {
    console.log('📋 Step 1: Environment Setup');
    console.log('----------------------------');
    
    if (!existsSync('.env')) {
      if (existsSync('.env.example')) {
        console.log('📄 Copying .env.example to .env...');
        copyFileSync('.env.example', '.env');
        console.log('✅ .env file created');
      } else {
        console.log('⚠️  .env.example not found, creating basic .env...');
        const basicEnv = `# Batik Kenanga Environment Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_NODE_ENV=development
VITE_APP_URL=http://localhost:5173`;
        writeFileSync('.env', basicEnv);
        console.log('✅ Basic .env file created');
      }
      
      console.log('\n🔧 Please update your .env file with your Supabase credentials:');
      console.log('   1. Go to https://supabase.com/dashboard');
      console.log('   2. Select your project');
      console.log('   3. Go to Settings > API');
      console.log('   4. Copy the URL and keys to your .env file');
      
      const proceed = await question('\nHave you updated the .env file? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('⏳ Please update your .env file and run the setup again.');
        process.exit(0);
      }
    } else {
      console.log('✅ .env file exists');
      
      // Validate env file
      const envContent = readFileSync('.env', 'utf8');
      const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('your-supabase-url');
      const hasAnonKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('your-anon-key');
      
      if (!hasSupabaseUrl || !hasAnonKey) {
        console.log('⚠️  Please update your Supabase credentials in .env file');
        const proceed = await question('Continue anyway? (y/n): ');
        if (proceed.toLowerCase() !== 'y') {
          process.exit(0);
        }
      } else {
        console.log('✅ Supabase configuration looks good');
      }
    }
    console.log('');
  },

  async installDependencies() {
    console.log('📦 Step 2: Install Dependencies');
    console.log('-------------------------------');
    
    if (!existsSync('node_modules')) {
      console.log('📥 Installing dependencies...');
      try {
        await execAsync('npm install');
        console.log('✅ Dependencies installed successfully');
      } catch (error) {
        console.log('❌ Error installing dependencies:', error.message);
        console.log('💡 Try running: npm install --legacy-peer-deps');
        throw error;
      }
    } else {
      console.log('✅ Dependencies already installed');
    }
    console.log('');
  },

  async setupDatabase() {
    console.log('🗄️  Step 3: Database Setup');
    console.log('-------------------------');
    
    console.log('📋 To setup your Supabase database:');
    console.log('1. Go to your Supabase Dashboard > SQL Editor');
    console.log('2. Run the following SQL files in order:');
    console.log('   a. supabase/schema.sql (creates tables and indexes)');
    console.log('   b. supabase/security.sql (sets up RLS policies)');
    console.log('   c. supabase/sample-data.sql (adds sample data)');
    
    const setupDb = await question('\nHave you run the SQL files? (y/n): ');
    if (setupDb.toLowerCase() === 'y') {
      console.log('✅ Database setup completed');
    } else {
      console.log('⏳ Please setup your database and continue');
    }
    console.log('');
  },

  async createAdminUser() {
    console.log('👤 Step 4: Create Admin User');
    console.log('-----------------------------');
    
    console.log('📋 To create an admin user:');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Click "Add user"');
    console.log('3. Fill in:');
    console.log('   • Email: admin@batikkenanga.com');
    console.log('   • Password: [your secure password]');
    console.log('   • Email Confirm: ✅ (check this box)');
    console.log('4. Click "Create user"');
    console.log('5. Run this SQL to set admin role:');
    console.log(`
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     COALESCE(raw_user_meta_data, '{}'),
     '{role}',
     '"admin"'
   )
   WHERE email = 'admin@batikkenanga.com';`);
    
    const adminCreated = await question('\nHave you created the admin user? (y/n): ');
    if (adminCreated.toLowerCase() === 'y') {
      console.log('✅ Admin user setup completed');
    } else {
      console.log('⏳ Please create admin user to access the admin panel');
    }
    console.log('');
  },

  async startDevelopment() {
    console.log('🚀 Step 5: Start Development Server');
    console.log('-----------------------------------');
    
    const startNow = await question('Start the development server now? (y/n): ');
    if (startNow.toLowerCase() === 'y') {
      console.log('🔥 Starting development server...');
      console.log('📱 Frontend: http://localhost:5173');
      console.log('🔐 Admin Panel: http://localhost:5173/admin/login');
      console.log('\n⌨️  Press Ctrl+C to stop the server\n');
      
      try {
        await execAsync('npm run dev', { stdio: 'inherit' });
      } catch (error) {
        console.log('Server stopped');
      }
    } else {
      console.log('💡 To start development later, run: npm run dev');
    }
  },

  async showSummary() {
    console.log('\n🎉 Setup Complete!');
    console.log('==================');
    console.log('✅ Environment configured');
    console.log('✅ Dependencies installed');
    console.log('✅ Database setup instructions provided');
    console.log('✅ Admin user creation instructions provided');
    
    console.log('\n🔗 Important URLs:');
    console.log('   • Frontend: http://localhost:5173');
    console.log('   • Admin Login: http://localhost:5173/admin/login');
    console.log('   • Admin Setup: http://localhost:5173/admin/setup');
    
    console.log('\n📚 Documentation:');
    console.log('   • docs/QUICK_START.md - Quick start guide');
    console.log('   • docs/ADMIN_PANEL.md - Admin panel documentation');
    
    console.log('\n🛠️  Useful Commands:');
    console.log('   • npm run dev - Start development server');
    console.log('   • npm run build - Build for production');
    console.log('   • node scripts/health-check.js - Check application health');
    console.log('   • node scripts/setup-admin.js - Admin user setup help');
    
    console.log('\n🤝 Need Help?');
    console.log('   • Check the documentation in the docs/ folder');
    console.log('   • Review the example files in the project');
    console.log('   • Make sure your Supabase project is properly configured');
  }
};

async function runSetup() {
  try {
    await steps.checkEnvironment();
    await steps.installDependencies();
    await steps.setupDatabase();
    await steps.createAdminUser();
    await steps.showSummary();
    
    const startServer = await question('\nWould you like to start the development server? (y/n): ');
    if (startServer.toLowerCase() === 'y') {
      await steps.startDevelopment();
    }
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n💡 Try running individual steps manually or check the documentation');
  } finally {
    rl.close();
  }
}

// Run the setup
runSetup();
