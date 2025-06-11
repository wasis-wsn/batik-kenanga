-- Seed data for categories
insert into public.categories (slug, name, description, image_url) values
('batik-kenanga-collection', 'Koleksi Batik Kenanga', 'Pilihan batik eksklusif dengan motif khas Batik Kenanga dengan satu warna dan satu motif cap.', 'images/batik_koleksi.jpg'),
('custom-color', 'Koleksi Warna Custom', 'Wujudkan identitas unik Anda dengan batik yang menggunakan lebih dari satu warna.', 'images/batik_warna_custom.jpg'),
('custom-design', 'Custom Mix Design', 'Kombinasikan berbagai motif, warna, dan teknik untuk menciptakan batik yang benar-benar personal dan eksklusif.', 'images/batik_mix_design.jpg');

-- Seed data for company info
insert into public.company_info (
  name, tagline, established, logo_url_light, hero_image, hero_video, home_page_image, profile_image,
  mission, vision, profile_singkat, values, why_choose_us, contact_info, social_media
) values (
  'Batik Kenanga',
  'Batik bukan hanya sekedar motif, tapi proses',
  1998,
  '/images/batik_kenanga_logo.png',
  '/images/batik_background.jpg',
  '/videos/video_batik_kenanga.mp4',
  '/images/home_page_batik.jpg',
  'https://images.unsplash.com/photo-1666578296079-52024f45d962',
  'Melestarikan warisan adiluhung batik Nusantara seraya berinovasi untuk memenuhi kebutuhan identitas personal dan korporat masa kini.',
  'Menjadi rujukan utama batik kustom berkualitas tinggi yang merepresentasikan keindahan dan keragaman budaya Indonesia di kancah global.',
  'Bring Up Your Identity adalah filosofi Batik Kenanga yang mengajak setiap individu dan institusi mengekspresikan jati diri melalui batik. Melalui layanan kustomisasi warna dan motif, kami membantu Anda menciptakan batik yang merepresentasikan kepribadian, nilai, atau brand Anda. Kami percaya setiap orang berhak tampil dengan versi terbaik dirinya tanpa kehilangan akar budaya.',
  '[
    {
      "title": "Otentisitas",
      "description": "Menjaga kemurnian motif dan proses batik tradisional Indonesia."
    },
    {
      "title": "Kualitas Terbaik",
      "description": "Menggunakan bahan pilihan dan pengerjaan detail oleh pengrajin ahli."
    },
    {
      "title": "Inovasi Desain",
      "description": "Mengadaptasi tren modern tanpa meninggalkan akar budaya."
    },
    {
      "title": "Layanan Personal",
      "description": "Memberikan solusi kustomisasi batik yang sesuai dengan kebutuhan unik Anda."
    }
  ]'::jsonb,
  '[
    {
      "title": "Desain Eksklusif & Kustom",
      "description": "Wujudkan batik impian Anda, dari warna hingga motif yang unik.",
      "icon": "Palette"
    },
    {
      "title": "Kualitas Terjamin",
      "description": "Bahan premium dan pengerjaan teliti untuk kepuasan maksimal.",
      "icon": "ShieldCheck"
    },
    {
      "title": "Warisan Budaya",
      "description": "Setiap helai kain membawa cerita dan keindahan tradisi Indonesia.",
      "icon": "Scroll"
    },
    {
      "title": "Pelayanan Profesional",
      "description": "Tim kami siap membantu Anda dari konsultasi hingga produk jadi.",
      "icon": "Users"
    }
  ]'::jsonb,
  '{
    "address": "Jl. Batik Kenanga No. 123, Solo, Jawa Tengah",
    "phone": "+62 271 123456",
    "email": "info@batikkenanga.com",
    "whatsapp": "+62 812 3456 7890"
  }'::jsonb,
  '{
    "instagram": "https://instagram.com/batikkenanga",
    "facebook": "https://facebook.com/batikkenanga",
    "twitter": "https://twitter.com/batikkenanga"
  }'::jsonb
);

-- Get category IDs for foreign key references
-- Note: In a real scenario, you'd need to get these IDs after inserting categories
-- For this seed, we'll use the slug to match categories in a more complex way

-- Seed data for products
with category_batik_kenanga as (select id from public.categories where slug = 'batik-kenanga-collection'),
     category_custom_color as (select id from public.categories where slug = 'custom-color'),
     category_custom_design as (select id from public.categories where slug = 'custom-design')

insert into public.products (
  name, description, price, category_id, image_url, rating, stock, featured,
  colors, cap_patterns, tiedye_patterns, material, size, technique, origin, coloring, care_instructions
) values
(
  'Batik Kenanga Klasik Merah Marun',
  'Kain batik tulis halus dengan motif Parang Seling Kenanga dalam warna merah marun yang elegan, melambangkan kemakmuran dan keanggunan.',
  750000,
  (select id from category_batik_kenanga),
  '/images/batik1.jpg',
  4.8,
  15,
  true,
  ARRAY['merah'],
  ARRAY['budaya'],
  ARRAY[]::text[],
  'Katun Primisima',
  '2.4m x 1.15m',
  'Batik Tulis',
  'Solo, Indonesia',
  'Pewarna alam dari kulit kayu mahoni dan daun indigo untuk menghasilkan warna merah marun yang mendalam',
  'Cuci lembut dengan tangan, gunakan lerak atau sampo bayi. Jemur di tempat teduh, setrika dengan suhu sedang.'
),
(
  'Batik Kenanga Modern Biru Laut',
  'Desain kontemporer motif Mega Mendung dengan sentuhan modern Batik Kenanga, berwarna biru laut menenangkan, cocok untuk busana formal maupun kasual.',
  680000,
  (select id from category_batik_kenanga),
  '/images/batik2.jpg',
  4.7,
  10,
  true,
  ARRAY['biru'],
  ARRAY['abstrak'],
  ARRAY[]::text[],
  'Katun Halus',
  '2.2m x 1.1m',
  'Batik Cap Kombinasi Tulis',
  'Solo, Indonesia',
  'Pewarna sintetis berkualitas tinggi untuk ketahanan warna',
  'Cuci terpisah pada pencucian pertama, hindari pemutih.'
),
(
  'Batik Kenanga Hijau Daun',
  'Motif flora dengan dominasi warna hijau daun yang fresh dan natural, mencerminkan kesegaran alam tropis Indonesia.',
  720000,
  (select id from category_batik_kenanga),
  '/images/batik3.jpg',
  4.6,
  12,
  false,
  ARRAY['hijau'],
  ARRAY['budaya'],
  ARRAY[]::text[],
  'Katun Primisima',
  '2.3m x 1.1m',
  'Batik Tulis',
  'Solo, Indonesia',
  'Pewarna alam dari daun indigo dan kunyit',
  'Cuci dengan air dingin, jemur tidak langsung terkena sinar matahari.'
),
(
  'Custom Batik Multi Warna Elegant',
  'Batik custom dengan kombinasi warna elegan sesuai keinginan Anda. Cocok untuk seragam keluarga atau acara khusus.',
  950000,
  (select id from category_custom_color),
  '/images/batik4.jpg',
  4.9,
  8,
  true,
  ARRAY['pink', 'orange'],
  ARRAY['geometris'],
  ARRAY[]::text[],
  'Katun Sutra',
  '2.5m x 1.2m',
  'Batik Tulis Premium',
  'Solo, Indonesia',
  'Kombinasi pewarna alam dan sintetis untuk hasil optimal',
  'Dry clean recommended untuk menjaga kualitas warna.'
),
(
  'Batik Mix Design Eksklusif',
  'Kombinasi unik berbagai motif tradisional dengan sentuhan kontemporer. Setiap piece adalah karya seni yang tidak akan ada duanya.',
  1200000,
  (select id from category_custom_design),
  '/images/batik5.jpg',
  5.0,
  5,
  true,
  ARRAY['abstrak'],
  ARRAY['geometris', 'budaya'],
  ARRAY['spiral', 'gradasi'],
  'Katun Sutra Premium',
  '2.6m x 1.3m',
  'Batik Tulis + Cap + Tie Dye',
  'Solo, Indonesia',
  'Teknik pewarnaan bertingkat dengan 5 tahap proses',
  'Perawatan khusus - konsultasi dengan customer service.'
);

-- Seed data for product images
insert into public.product_images (product_id, url, caption, is_primary)
select 
  p.id,
  '/images/batikdetail1.jpg',
  'Detail motif parang seling kenanga',
  false
from public.products p where p.name = 'Batik Kenanga Klasik Merah Marun'
union all
select 
  p.id,
  '/images/batikdetail2.jpg',
  'Tekstur kain primisima',
  false
from public.products p where p.name = 'Batik Kenanga Klasik Merah Marun'
union all
select 
  p.id,
  '/images/batikdetail3.jpg',
  'Detail finishing jahitan',
  false
from public.products p where p.name = 'Batik Kenanga Modern Biru Laut';

-- Seed data for news
insert into public.news (
  title, slug, category, author, image_url, excerpt, content, tags, related_images, published, published_at
) values
(
  'Batik Kenanga Raih Penghargaan Best Heritage Preservation 2024',
  'batik-kenanga-raih-penghargaan-2024',
  'Penghargaan',
  'Tim Redaksi',
  '/images/batik_news1.jpg',
  'Batik Kenanga berhasil meraih penghargaan bergengsi dalam ajang Indonesia Heritage Awards 2024...',
  '<p>Batik Kenanga kembali mengukir prestasi membanggakan dengan meraih penghargaan Best Heritage Preservation dalam ajang Indonesia Heritage Awards 2024. Penghargaan ini diberikan atas dedikasi dan konsistensi Batik Kenanga dalam melestarikan warisan budaya batik Indonesia.</p>

<p>Dalam ceremony yang digelar di Hotel Sultan Jakarta, Direktur Batik Kenanga, Ibu Sarah Wijaya, menerima penghargaan tersebut langsung dari Menteri Pariwisata dan Ekonomi Kreatif. "Penghargaan ini menjadi motivasi bagi kami untuk terus berinovasi sambil tetap menjaga keaslian dan nilai-nilai tradisional batik," ujar Sarah dalam sambutannya.</p>

<h2>Komitmen Pelestarian Warisan Budaya</h2>
<p>Selama lebih dari dua dekade, Batik Kenanga telah konsisten menerapkan teknik tradisional dalam setiap produksinya. Para pengrajin batik di Batik Kenanga masih menggunakan canting tradisional dan pewarna alami, memastikan setiap lembar batik yang dihasilkan memiliki nilai artistik dan historis yang tinggi.</p>',
  ARRAY['penghargaan', 'warisan budaya', 'batik tradisional'],
  ARRAY['/images/batik_news1-2.jpg', '/images/batik_news1-4.jpg', '/images/batik_news1-5.jpg'],
  true,
  '2024-03-15 10:00:00+00'
),
(
  'Kolaborasi Batik Kenanga dengan Desainer Internasional',
  'kolaborasi-batik-kenanga-desainer-internasional',
  'Fashion',
  'Tim Redaksi',
  '/images/batik_news2.jpg',
  'Batik Kenanga menjalin kerjasama dengan desainer internasional dalam menghadirkan koleksi batik kontemporer...',
  '<p>Batik Kenanga mengumumkan kolaborasi eksklusif dengan desainer internasional ternama, Michelle Chen, dalam menghadirkan koleksi batik kontemporer yang memadukan unsur tradisional dengan sentuhan modern.</p>

<p>Koleksi ini akan menampilkan 20 desain eksklusif yang menggabungkan motif klasik batik dengan elemen fashion kontemporer. "Kami ingin menunjukkan bahwa batik bisa sangat versatile dan relevan dengan fashion modern," ungkap Michelle Chen.</p>

<h2>Inovasi dalam Tradisi</h2>
<p>Kolaborasi ini menjadi bukti bahwa Batik Kenanga terus berinovasi sambil tetap menghormati nilai-nilai tradisional. Setiap piece dalam koleksi ini dikerjakan dengan teknik tradisional namun menghadirkan desain yang fresh dan modern.</p>',
  ARRAY['fashion', 'kolaborasi', 'inovasi'],
  ARRAY['/images/batik_news1-1.jpg', '/images/batik_news1-3.jpg', '/images/batik_news1-6.jpg'],
  true,
  '2024-02-28 14:30:00+00'
);

-- Seed data for testimonials
insert into public.testimonials (
  customer_name, category, product_name, year, image_url, feedback, image_gallery, logo_url, colors, printing_method
) values
(
  'Keluarga Bagus Muhammad Nur',
  'custom',
  'Batik Custom Keluarga Artis',
  2024,
  '/images/customer1.jpeg',
  'Sangat puas dengan hasil batik custom dari Batik Kenanga. Detail motifnya indah dan cocok untuk keluarga kami. Pengerjaan sangat profesional dan tepat waktu.',
  ARRAY['/images/customer1-1.jpg', '/images/customer1-2.jpg', '/images/customer1-3.jpg'],
  '/images/sample-logo.jpeg',
  '[
    {"name": "Coklat Kayu", "hex": "#513621"},
    {"name": "Emas", "hex": "#C3793A"},
    {"name": "Kuningan", "hex": "#FFE199"}
  ]'::jsonb,
  '{
    "image": "/images/teknikbatik1.jpg",
    "description": "Batik tulis premium dengan pewarnaan alami, menghasilkan gradasi warna yang elegan dan eksklusif."
  }'::jsonb
),
(
  'Keluarga SBY',
  'corporate',
  'Batik Eksklusif Acara Kenegaraan',
  2023,
  '/images/customer2.jpeg',
  'Batik Kenanga dipercaya untuk membuat batik eksklusif keluarga kami. Hasilnya sangat memuaskan dengan kualitas terbaik.',
  ARRAY['/images/customer2-1.jpg', '/images/customer2-2.jpg', '/images/customer2-3.jpg'],
  '/images/sample-logo.jpeg',
  '[
    {"name": "Biru Navy", "hex": "#1e3a8a"},
    {"name": "Emas", "hex": "#fbbf24"},
    {"name": "Putih", "hex": "#ffffff"}
  ]'::jsonb,
  '{
    "image": "/images/teknikbatik2.png",
    "description": "Batik cap premium dengan finishing hand-touch untuk detail yang sempurna."
  }'::jsonb
),
(
  'Komunitas Batik Nusantara',
  'community',
  'Batik Seragam Komunitas',
  2024,
  '/images/customer3.jpeg',
  'Terima kasih Batik Kenanga telah membantu mewujudkan identitas komunitas kami melalui batik yang indah dan berkualitas.',
  ARRAY['/images/customer3-1.jpg', '/images/customer3-2.jpg', '/images/customer3-3.jpg'],
  '/images/sample-logo.jpeg',
  '[
    {"name": "Hijau Daun", "hex": "#16a34a"},
    {"name": "Coklat Tanah", "hex": "#a16207"},
    {"name": "Krem", "hex": "#fef3c7"}
  ]'::jsonb,
  '{
    "image": "/images/teknikbatik3.jpg",
    "description": "Kombinasi teknik cap dan tulis untuk hasil yang optimal dengan harga terjangkau."
  }'::jsonb
);

-- Seed data for admin users (password: admin123 - should be hashed in production)
insert into public.admin_users (email, password_hash, name, role) values
('admin@batikkenanga.com', '$2b$10$rOtPo8yKFqKF8rKnFzEpUOhTm1cMqYwKJ6HhPzBzHzwUKZdqRVGti', 'Admin Batik Kenanga', 'super_admin'),
('editor@batikkenanga.com', '$2b$10$rOtPo8yKFqKF8rKnFzEpUOhTm1cMqYwKJ6HhPzBzHzwUKZdqRVGti', 'Editor Batik Kenanga', 'editor');

-- Seed data for settings
insert into public.settings (key, value, description) values
('site_maintenance', 'false', 'Site maintenance mode'),
('max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', '["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"]', 'Allowed file types for upload'),
('contact_email', '"info@batikkenanga.com"', 'Main contact email'),
('business_hours', '"Senin-Jumat: 08:00-17:00, Sabtu: 08:00-15:00"', 'Business operating hours');
