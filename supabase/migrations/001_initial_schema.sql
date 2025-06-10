-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  rating numeric(3,2) default 0,
  stock integer default 0,
  featured boolean default false,
  colors text[] default '{}',
  cap_patterns text[] default '{}',
  tiedye_patterns text[] default '{}',
  material text,
  size text,
  technique text,
  origin text,
  coloring text,
  care_instructions text,
  stamping_tools text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create product_images table
create table public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  caption text,
  is_primary boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create news table
create table public.news (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  category text not null,
  author text not null,
  image_url text,
  excerpt text,
  content text,
  tags text[] default '{}',
  related_images text[] default '{}',
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create testimonials table
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  customer_name text not null,
  category text not null,
  product_name text not null,
  year integer not null,
  image_url text,
  feedback text not null,
  image_gallery text[] default '{}',
  logo_url text,
  colors jsonb default '[]',
  printing_method jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create company_info table
create table public.company_info (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  tagline text,
  established integer,
  logo_url_light text,
  hero_image text,
  hero_video text,
  home_page_image text,
  profile_image text,
  mission text,
  vision text,
  profile_singkat text,
  values jsonb default '[]',
  why_choose_us jsonb default '[]',
  team jsonb default '[]',
  contact_info jsonb default '{}',
  social_media jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create admin_users table
create table public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text default 'admin' check (role in ('admin', 'editor', 'super_admin')),
  avatar_url text,
  is_active boolean default true,
  last_login timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create media_library table for file management
create table public.media_library (
  id uuid default uuid_generate_v4() primary key,
  filename text not null,
  original_name text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  alt_text text,
  created_by uuid references public.admin_users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create settings table
create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.news enable row level security;
alter table public.testimonials enable row level security;
alter table public.company_info enable row level security;
alter table public.admin_users enable row level security;
alter table public.media_library enable row level security;
alter table public.settings enable row level security;

-- Create policies for public access (read-only)
create policy "Allow public read access on categories" on public.categories for select using (true);
create policy "Allow public read access on products" on public.products for select using (true);
create policy "Allow public read access on product_images" on public.product_images for select using (true);
create policy "Allow public read access on published news" on public.news for select using (published = true);
create policy "Allow public read access on testimonials" on public.testimonials for select using (true);
create policy "Allow public read access on company_info" on public.company_info for select using (true);
create policy "Allow public read access on media_library" on public.media_library for select using (true);
create policy "Allow public read access on settings" on public.settings for select using (true);

-- Create functions to update updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_categories_updated_at before update on public.categories for each row execute procedure update_updated_at_column();
create trigger update_products_updated_at before update on public.products for each row execute procedure update_updated_at_column();
create trigger update_news_updated_at before update on public.news for each row execute procedure update_updated_at_column();
create trigger update_testimonials_updated_at before update on public.testimonials for each row execute procedure update_updated_at_column();
create trigger update_company_info_updated_at before update on public.company_info for each row execute procedure update_updated_at_column();
create trigger update_admin_users_updated_at before update on public.admin_users for each row execute procedure update_updated_at_column();
create trigger update_settings_updated_at before update on public.settings for each row execute procedure update_updated_at_column();

-- Create indexes for better performance
create index idx_products_category_id on public.products(category_id);
create index idx_products_featured on public.products(featured);
create index idx_news_published on public.news(published);
create index idx_news_slug on public.news(slug);
create index idx_categories_slug on public.categories(slug);
create index idx_product_images_product_id on public.product_images(product_id);
