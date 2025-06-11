-- Insert sample colors
INSERT INTO colors (name) VALUES 
('Biru'),
('Merah'),
('Hijau'),
('Orange'),
('Pink'),
('Kuning'),
('Ungu'),
('Hitam'),
('Putih');

-- Insert sample cap patterns
INSERT INTO cap_patterns (name) VALUES 
('Motif Budaya'),
('Motif Flora'),
('Motif Fauna'),
('Motif Abstrak'),
('Motif Geometris'),
('Motif Kenanga');

-- Insert sample tiedye patterns
INSERT INTO tiedye_patterns (name) VALUES 
('Serat Kayu'),
('Kelereng'),
('Kerut'),
('Spiral'),
('Gradasi'),
('Tie-dye Traditional');

-- Insert sample categories
INSERT INTO categories (slug, name, description, image_url) VALUES 
('batik-kenanga-collection', 'Koleksi Batik Kenanga', 'Pilihan batik eksklusif dengan motif khas Batik Kenanga dengan satu warna dan satu motif cap.', 'images/category/0/category1.jpg'),
('custom-color', 'Koleksi Warna Custom', 'Wujudkan identitas unik Anda dengan batik yang menggunakan lebih dari satu warna.', 'images/category/1/category2.jpg'),
('custom-design', 'Custom Mix Design', 'Kombinasikan berbagai motif, warna, dan teknik untuk menciptakan batik yang benar-benar personal dan eksklusif.', 'images/category/2/category3.jpg');
