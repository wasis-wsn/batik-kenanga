// Mock data untuk development ketika Supabase belum setup
export const mockCategories = [
  {
    id: '1',
    name: 'Batik Cap',
    slug: 'batik-cap',
    description: 'Batik dengan teknik cap menggunakan alat cap tembaga',
    created_at: '2024-01-01T00:00:00Z',
    product_count: 12
  },
  {
    id: '2',
    name: 'Batik Tulis',
    slug: 'batik-tulis',
    description: 'Batik dengan teknik tulis menggunakan canting',
    created_at: '2024-01-01T00:00:00Z',
    product_count: 8
  },
  {
    id: '3',
    name: 'Batik Tie Dye',
    slug: 'batik-tie-dye',
    description: 'Batik dengan teknik tie dye modern',
    created_at: '2024-01-01T00:00:00Z',
    product_count: 15
  }
];

export const mockProducts = [
  {
    id: '1',
    name: 'Batik Cap Mega Mendung',
    slug: 'batik-cap-mega-mendung',
    description: 'Batik cap dengan motif mega mendung khas Cirebon',
    price: 250000,
    category_id: '1',
    featured: true,
    stock: 10,
    created_at: '2024-01-01T00:00:00Z',
    categories: { name: 'Batik Cap', slug: 'batik-cap' },
    product_images: [
      { url: '/images/batik1.jpg', caption: 'Batik Cap Mega Mendung', is_primary: true }
    ]
  },
  {
    id: '2',
    name: 'Batik Tulis Parang',
    slug: 'batik-tulis-parang',
    description: 'Batik tulis dengan motif parang tradisional',
    price: 450000,
    category_id: '2',
    featured: true,
    stock: 5,
    created_at: '2024-01-02T00:00:00Z',
    categories: { name: 'Batik Tulis', slug: 'batik-tulis' },
    product_images: [
      { url: '/images/batik2.jpg', caption: 'Batik Tulis Parang', is_primary: true }
    ]
  },
  {
    id: '3',
    name: 'Batik Tie Dye Modern',
    slug: 'batik-tie-dye-modern',
    description: 'Batik tie dye dengan desain modern dan warna cerah',
    price: 180000,
    category_id: '3',
    featured: false,
    stock: 20,
    created_at: '2024-01-03T00:00:00Z',
    categories: { name: 'Batik Tie Dye', slug: 'batik-tie-dye' },
    product_images: [
      { url: '/images/batik3.jpg', caption: 'Batik Tie Dye Modern', is_primary: true }
    ]
  }
];

export const mockNews = [
  {
    id: '1',
    title: 'Pameran Batik Kenanga di Jakarta',
    slug: 'pameran-batik-kenanga-jakarta',
    content: 'Batik Kenanga mengikuti pameran batik terbesar di Jakarta...',
    excerpt: 'Batik Kenanga akan mengikuti pameran batik di Jakarta',
    featured_image: '/images/batik_news1.jpg',
    status: 'published',
    category: 'Event',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Kolaborasi dengan Desainer Ternama',
    slug: 'kolaborasi-desainer-ternama',
    content: 'Batik Kenanga berkolaborasi dengan desainer ternama untuk koleksi terbaru...',
    excerpt: 'Kolaborasi menghasilkan desain batik yang inovatif',
    featured_image: '/images/batik_news2.jpg',
    status: 'published',
    category: 'Kolaborasi',
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const mockTestimonials = [
  {
    id: '1',
    customer_name: 'Sari Indah',
    product_name: 'Batik Cap Mega Mendung',
    content: 'Kualitas batiknya sangat bagus dan motifnya indah sekali!',
    rating: 5,
    is_featured: true,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    customer_name: 'Budi Santoso',
    product_name: 'Batik Tulis Parang',
    content: 'Batik tulis asli dengan kualitas premium. Sangat puas!',
    rating: 5,
    is_featured: true,
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    customer_name: 'Rina Maharani',
    product_name: 'Batik Tie Dye Modern',
    content: 'Desain modern tapi tetap mempertahankan nilai tradisional.',
    rating: 4,
    is_featured: false,
    created_at: '2024-01-03T00:00:00Z'
  }
];
