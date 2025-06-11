import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qojlgridoruusocgwsdw.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You need to set this in your environment

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  console.log('You can find your service role key in your Supabase project dashboard under Settings > API')
  process.exit(1)
}

// Create admin client with service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUsers() {
  console.log('Creating admin users...')
  
  try {
    // Create super admin user
    const { data: superAdmin, error: superAdminError } = await supabase.auth.admin.createUser({
      email: 'admin@batikkenanga.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Admin Batik Kenanga',
        role: 'super_admin'
      }
    })
    
    if (superAdminError) {
      console.error('Error creating super admin:', superAdminError)
    } else {
      console.log('Super admin created:', superAdmin.user.email)
    }

    // Create editor user
    const { data: editor, error: editorError } = await supabase.auth.admin.createUser({
      email: 'editor@batikkenanga.com',
      password: 'editor123',
      email_confirm: true,
      user_metadata: {
        name: 'Editor Batik Kenanga',
        role: 'editor'
      }
    })
    
    if (editorError) {
      console.error('Error creating editor:', editorError)
    } else {
      console.log('Editor created:', editor.user.email)
    }

    console.log('Admin users created successfully!')
    console.log('You can now login with:')
    console.log('- admin@batikkenanga.com / admin123 (Super Admin)')
    console.log('- editor@batikkenanga.com / editor123 (Editor)')
    
  } catch (error) {
    console.error('Error creating admin users:', error)
  } finally {
    process.exit(0)
  }
}

createAdminUsers()
