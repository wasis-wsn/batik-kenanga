
export const products = [
  {
    id: 1,
    name: "Batik Kenanga Klasik Merah Marun",
    description: "Kain batik tulis halus dengan motif Parang Seling Kenanga dalam warna merah marun yang elegan, melambangkan kemakmuran dan keanggunan.",
    price: 750000,
    category: "batik-kenanga-collection",
    imageUrl: "https://images.unsplash.com/photo-1580308782063-69551a8dc68c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxyZWQlMjBiYXRpayUyMHRleHRpbGV8ZW58MHx8fHwxNzA5NzMwODQzfDA&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.8,
    stock: 15,
    featured: true,
    details: {
      material: "Katun Primisima",
      size: "2.4m x 1.15m",
      technique: "Batik Tulis",
      origin: "Solo, Indonesia",
      careInstructions: "Cuci lembut dengan tangan, gunakan lerak atau sampo bayi. Jemur di tempat teduh, setrika dengan suhu sedang."
    }
  },
  {
    id: 2,
    name: "Batik Kenanga Modern Biru Laut",
    description: "Desain kontemporer motif Mega Mendung dengan sentuhan modern Batik Kenanga, berwarna biru laut menenangkan, cocok untuk busana formal maupun kasual.",
    price: 680000,
    category: "batik-kenanga-collection",
    imageUrl: "https://images.unsplash.com/photo-1597976618063-810eb50c84b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwyfHxibHVlJTIwYmF0aWslMjB0ZXh0aWxlfGVufDB8fHx8MTcwOTczMDg0M3ww&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.7,
    stock: 10,
    featured: true,
    details: {
      material: "Katun Halus",
      size: "2.2m x 1.1m",
      technique: "Batik Cap Kombinasi Tulis",
      origin: "Pekalongan, Indonesia",
      careInstructions: "Cuci lembut dengan tangan, gunakan lerak atau sampo bayi. Jemur di tempat teduh, setrika dengan suhu sedang."
    }
  },
  {
    id: 3,
    name: "Batik Kenanga Motif Sogan Coklat",
    description: "Kehangatan warna sogan klasik dalam motif Truntum Kenanga yang sarat makna. Kain batik tulis premium untuk momen istimewa Anda.",
    price: 820000,
    category: "batik-kenanga-collection",
    imageUrl: "https://images.unsplash.com/photo-1568252542512-9a1b5e8a94a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxicm93biUyMGJhdGlrJTIwdGV4dGlsZXxlbnwwfHx8fDE3MDk3MzA4NDN8MA&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.9,
    stock: 8,
    featured: true,
    details: {
      material: "Sutra ATBM",
      size: "2.5m x 1.15m",
      technique: "Batik Tulis",
      origin: "Solo, Indonesia",
      careInstructions: "Dry clean direkomendasikan. Jika cuci tangan, gunakan sampo sutra, jangan diperas."
    }
  },
  {
    id: 4,
    name: "Custom Warna Logo Perusahaan A",
    description: "Seragam batik dengan warna korporat perusahaan A (biru navy dan emas) dalam motif geometris modern yang mencerminkan identitas perusahaan.",
    price: 550000,
    category: "custom-color",
    imageUrl: "https://images.unsplash.com/photo-1632198007630-64a196aceeca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxuYXZ5JTIwYmx1ZSUyMGJhdGlrJTIwdGV4dGlsZXxlbnwwfHx8fDE3MDk3MzA4NDN8MA&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.5,
    stock: 50, 
    featured: false,
    details: {
      material: "Katun Premium",
      size: "Sesuai pesanan (per meter atau per potong)",
      technique: "Batik Cap",
      origin: "Workshop Batik Kenanga",
      careInstructions: "Cuci terpisah pada awalnya, selanjutnya cuci lembut. Hindari pemutih."
    }
  },
  {
    id: 5,
    name: "Custom Warna Logo Organisasi B",
    description: "Kain batik untuk komunitas organisasi B dengan palet warna hijau dan putih khas logo, menggunakan motif flora endemik sebagai simbol pertumbuhan.",
    price: 600000,
    category: "custom-color",
    imageUrl: "https://images.unsplash.com/photo-1519830049707-513f7995def5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGJhdGlrJTIwdGV4dGlsZXxlbnwwfHx8fDE3MDk3MzA4NDN8MA&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.6,
    stock: 30,
    featured: false,
    details: {
      material: "Katun Dobby",
      size: "Sesuai pesanan",
      technique: "Batik Kombinasi Cap dan Tulis",
      origin: "Workshop Batik Kenanga",
      careInstructions: "Cuci lembut, jemur di tempat teduh."
    }
  },
  {
    id: 6,
    name: "Custom Mix Design Kenanga & Parang",
    description: "Perpaduan unik motif khas Batik Kenanga dengan elemen klasik Parang, menciptakan desain eksklusif yang kuat dan anggun. Pilihan warna dapat disesuaikan.",
    price: 950000,
    category: "custom-design",
    imageUrl: "https://images.unsplash.com/photo-1543306977-1390f7858abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxiYXRpayUyMHBhcmFuZyUyMG1peGVkfGVufDB8fHx8MTcwOTczMDg0M3ww&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.9,
    stock: 5, 
    featured: false,
    details: {
      material: "Sutra Crepe",
      size: "2.6m x 1.15m",
      technique: "Batik Tulis Halus",
      origin: "Workshop Batik Kenanga",
      careInstructions: "Dry clean sangat direkomendasikan untuk menjaga kehalusan sutra dan warna."
    }
  },
  {
    id: 7,
    name: "Custom Mix Design Modern Abstrak",
    description: "Desain batik abstrak modern yang terinspirasi dari elemen alam, dikombinasikan dengan teknik pewarnaan gradasi khas Batik Kenanga. Untuk Anda yang berjiwa dinamis.",
    price: 880000,
    category: "custom-design",
    imageUrl: "https://images.unsplash.com/photo-1618220292959-099049937884?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJhdGlrJTIwdGV4dGlsZXxlbnwwfHx8fDE3MDk3MzA4NDN8MA&ixlib=rb-4.0.3&q=80&w=1080",
    rating: 4.7,
    stock: 7,
    featured: false,
    details: {
      material: "Katun Primisima Mercerized",
      size: "2.5m x 1.15m",
      technique: "Batik Lukis Kombinasi Tulis",
      origin: "Workshop Batik Kenanga",
      careInstructions: "Cuci tangan dengan hati-hati, gunakan sampo. Jangan disikat."
    }
  }
];

export const categories = [
  {
    id: "batik-kenanga-collection",
    name: "Koleksi Batik Kenanga",
    description: "Pilihan batik eksklusif dengan motif khas Batik Kenanga, tersedia dalam berbagai warna dan desain (satu warna satu desain).",
    imageUrl: "https://images.unsplash.com/photo-1604803899404-3883a1c9e61e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxiYXRpayUyMGNvbGxlY3Rpb258ZW58MHx8fHwxNzA5NzMyMjA0fDA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "custom-color",
    name: "Koleksi Warna Custom",
    description: "Wujudkan identitas unik Anda dengan batik yang warnanya disesuaikan dengan logo perusahaan atau organisasi Anda.",
    imageUrl: "https://images.unsplash.com/photo-1555425256-d3c1645f9010?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxiYXRpayUyMGNvbG9yJTIwcGFsZXR0ZXxlbnwwfHx8fDE3MDk3MzIyMDR8MA&ixlib=rb-4.0.3&q=80&w=1080"
  },
  {
    id: "custom-design",
    name: "Custom Mix Design",
    description: "Kombinasikan berbagai motif dan elemen desain untuk menciptakan batik yang benar-benar personal dan eksklusif.",
    imageUrl: "https://images.unsplash.com/photo-1597976618063-810eb50c84b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwyfHxibHVlJTIwYmF0aWslMjB0ZXh0aWxlfGVufDB8fHx8MTcwOTczMDg0M3ww&ixlib=rb-4.0.3&q=80&w=1080"
  }
];

export const companyInfo = {
  name: "Batik Kenanga",
  tagline: "Identitas Batik Indonesia",
  established: 2008,
  logoUrl: "https://storage.googleapis.com/hostinger-horizons-assets-prod/320532f1-3227-41f3-9ad1-4a8eeb3727e2/ea691a91753d2a8c0914a8015482aa14.jpg",
  heroImage: "https://storage.googleapis.com/hostinger-horizons-assets-prod/320532f1-3227-41f3-9ad1-4a8eeb3727e2/7624e56280f082bfbed3340d8908344c.jpg",
  profileImage: "https://images.unsplash.com/photo-1632198007630-64a196aceeca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxiYXRpayUyMHdvcmtzaG9wfGVufDB8fHx8MTcwOTczMjQzNXww&ixlib=rb-4.0.3&q=80&w=1080",
  mission: "Melestarikan warisan adiluhung batik Nusantara seraya berinovasi untuk memenuhi kebutuhan identitas personal dan korporat masa kini.",
  vision: "Menjadi rujukan utama batik kustom berkualitas tinggi yang merepresentasikan keindahan dan keragaman budaya Indonesia di kancah global.",
  profileSingkat: "Batik Kenanga, berakar di Solo, jantung budaya Jawa, berdedikasi untuk mempersembahkan keindahan batik otentik. Kami menggabungkan pakem tradisional dengan sentuhan modern, menawarkan koleksi eksklusif serta layanan kustomisasi untuk batik yang benar-benar mencerminkan identitas Anda atau organisasi Anda. Setiap helai kain adalah cerita, ditenun dengan passion dan keahlian turun-temurun.",
  values: [
    {
      title: "Otentisitas",
      description: "Menjaga kemurnian motif dan proses batik tradisional Indonesia."
    },
    {
      title: "Kualitas Terbaik",
      description: "Menggunakan bahan pilihan dan pengerjaan detail oleh pengrajin ahli."
    },
    {
      title: "Inovasi Desain",
      description: "Mengadaptasi tren modern tanpa meninggalkan akar budaya."
    },
    {
      title: "Layanan Personal",
      description: "Memberikan solusi kustomisasi batik yang sesuai dengan kebutuhan unik Anda."
    }
  ],
  whyChooseUs: [
    {
      title: "Desain Eksklusif & Kustom",
      description: "Wujudkan batik impian Anda, dari warna hingga motif yang unik.",
      icon: "Palette" 
    },
    {
      title: "Kualitas Terjamin",
      description: "Bahan premium dan pengerjaan teliti untuk kepuasan maksimal.",
      icon: "ShieldCheck"
    },
    {
      title: "Warisan Budaya",
      description: "Setiap helai kain membawa cerita dan keindahan tradisi Indonesia.",
      icon: "Scroll"
    },
    {
      title: "Pelayanan Profesional",
      description: "Tim kami siap membantu Anda dari konsultasi hingga produk jadi.",
      icon: "Users"
    }
  ],
  team: [
    {
      name: "Ibu Kenanga Sari",
      position: "Pendiri & Maestro Batik",
      bio: "Dengan lebih dari 30 tahun pengalaman, Ibu Kenanga adalah jantung dan jiwa dari setiap desain yang lahir.",
      imageUrl: "https://images.unsplash.com/photo-1580308782063-69551a8dc68c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwaW5kb25lc2lhbiUyMHdvbWFuJTIwYmF0aWt8ZW58MHx8fHwxNzA5NzMyNzYyfDA&ixlib=rb-4.0.3&q=80&w=1080" 
    },
    {
      name: "Bapak Agung P.",
      position: "Manajer Produksi & Kualitas",
      bio: "Memastikan setiap detail dan kualitas batik memenuhi standar tertinggi Batik Kenanga.",
      imageUrl: "https://images.unsplash.com/photo-1597976618063-810eb50c84b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjAzNTV8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwbWFuJTIwYmF0aWt8ZW58MHx8fHwxNzA5NzMyNzYyfDA&ixlib=rb-4.0.3&q=80&w=1080"
    },
  ],
};
