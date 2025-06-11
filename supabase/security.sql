-- Batik Kenanga Security Policies
-- Run this in Supabase Dashboard > SQL Editor after creating the schema

-- Enable Row Level Security on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Categories policies
-- Public read access for active categories
CREATE POLICY "Public categories read" ON categories
  FOR SELECT USING (is_active = true);

-- Admin full access to categories
CREATE POLICY "Admin categories full access" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Products policies
-- Public read access for active products
CREATE POLICY "Public products read" ON products
  FOR SELECT USING (is_active = true);

-- Admin full access to products
CREATE POLICY "Admin products full access" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- News policies
-- Public read access for published news
CREATE POLICY "Public news read" ON news
  FOR SELECT USING (is_published = true);

-- Admin full access to news
CREATE POLICY "Admin news full access" ON news
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Testimonials policies
-- Public read access for approved testimonials
CREATE POLICY "Public testimonials read" ON testimonials
  FOR SELECT USING (is_approved = true);

-- Admin full access to testimonials
CREATE POLICY "Admin testimonials full access" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Company info policies
-- Public read access
CREATE POLICY "Public company info read" ON company_info
  FOR SELECT USING (true);

-- Admin update access
CREATE POLICY "Admin company info update" ON company_info
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Profiles policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admin can read all profiles
CREATE POLICY "Admin can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can manage all profiles
CREATE POLICY "Admin can manage profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Media policies
-- Public read access
CREATE POLICY "Public media read" ON media
  FOR SELECT USING (true);

-- Admin full access to media
CREATE POLICY "Admin media full access" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ language plpgsql security definer;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles 
    WHERE id = user_id
  );
END;
$$ language plpgsql security definer;
