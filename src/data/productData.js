export const products = [
  {
    id: 1,
    name: "Batik Kenanga Klasik Merah Marun",
    description: "Kain batik tulis halus dengan motif Parang Seling Kenanga dalam warna merah marun yang elegan, melambangkan kemakmuran dan keanggunan.",
    price: 750000,
    category: "batik-kenanga-collection",
    imageUrl: "/images/batik1.jpg",
    rating: 4.8,
    stock: 15,
    featured: true,
    colors: ["merah"],
    capPatterns: ["budaya"],
    tiedyePatterns: [],
    details: {
      material: "Katun Primisima",
      size: "2.4m x 1.15m",
      technique: "Batik Tulis",
      origin: "Solo, Indonesia",
      coloring: "Pewarna alam dari kulit kayu mahoni dan daun indigo untuk menghasilkan warna merah marun yang mendalam",
      careInstructions: "Cuci lembut dengan tangan, gunakan lerak atau sampo bayi. Jemur di tempat teduh, setrika dengan suhu sedang.",
      images: [
        {
          url: "/images/batikdetail1.jpg",
          caption: "Detail motif parang seling kenanga"
        },
        {
          url: "/images/batikdetail2.jpg",
          caption: "Tekstur kain primisima"
        }
      ],
      stampingTools: []
    }
  },
  {
    id: 2,
    name: "Batik Kenanga Modern Biru Laut",
    description: "Desain kontemporer motif Mega Mendung dengan sentuhan modern Batik Kenanga, berwarna biru laut menenangkan, cocok untuk busana formal maupun kasual.",
    price: 680000,
    category: "batik-kenanga-collection",
    imageUrl: "/images/batik2.jpg",
    rating: 4.7,
    stock: 10,
    featured: true,
    colors: ["biru"],
    capPatterns: ["abstrak"],
    tiedyePatterns: [],
    details: {
      material: "Katun Halus",
      size: "2.2m x 1.1m",
      technique: "Batik Cap Kombinasi Tulis",
      origin: "Pekalongan, Indonesia",
      coloring: "Pewarna sintetis Napthol dengan proses pencelupan ganda untuk ketahanan warna biru laut",
      careInstructions: "Cuci lembut dengan tangan, gunakan lerak atau sampo bayi. Jemur di tempat teduh, setrika dengan suhu sedang."
    }
  },
  {
    id: 3,
    name: "Batik Kenanga Motif Sogan Coklat",
    description: "Kehangatan warna sogan klasik dalam motif Truntum Kenanga yang sarat makna. Kain batik tulis premium untuk momen istimewa Anda.",
    price: 820000,
    category: "custom-design",
    imageUrl: "/images/batik3.jpg",
    rating: 4.9,
    stock: 8,
    featured: true,
    colors: ["orange", "merah"],
    capPatterns: ["flora"],
    tiedyePatterns: ["serat-kayu"],
    details: {
      material: "Sutra ATBM",
      size: "2.5m x 1.15m",
      technique: "Batik Tulis",
      origin: "Solo, Indonesia",
      coloring: "Pewarna alam dari kayu soga dan kulit jambal untuk menghasilkan warna sogan klasik",
      careInstructions: "Dry clean direkomendasikan. Jika cuci tangan, gunakan sampo sutra, jangan diperas."
    }
  },
  {
    id: 4,
    name: "Custom Warna Logo Perusahaan A",
    description: "Seragam batik dengan warna korporat perusahaan A (biru navy dan emas) dalam motif geometris modern yang mencerminkan identitas perusahaan.",
    price: 550000,
    category: "custom-color",
    imageUrl: "/images/batik4.jpg",
    rating: 4.5,
    stock: 50, 
    featured: true,
    colors: ["biru", "orange"],
    capPatterns: ["abstrak"],
    tiedyePatterns: [],
    details: {
      material: "Katun Premium",
      size: "Sesuai pesanan (per meter atau per potong)",
      technique: "Batik Cap",
      origin: "Workshop Batik Kenanga",
      coloring: "Pewarna sintetis dengan ketahanan warna tinggi, sesuai dengan standar industri",
      careInstructions: "Cuci terpisah pada awalnya, selanjutnya cuci lembut. Hindari pemutih."
    }
  },
  {
    id: 5,
    name: "Custom Warna Logo Organisasi B",
    description: "Kain batik untuk komunitas organisasi B dengan palet warna hijau dan putih khas logo, menggunakan motif flora endemik sebagai simbol pertumbuhan.",
    price: 600000,
    category: "custom-color",
    imageUrl: "/images/batik5.jpg",
    rating: 4.6,
    stock: 30,
    featured: true,
    colors: ["hijau", "pink"],
    capPatterns: ["flora"],
    tiedyePatterns: [],
    details: {
      material: "Katun Dobby",
      size: "Sesuai pesanan",
      technique: "Batik Kombinasi Cap dan Tulis",
      origin: "Workshop Batik Kenanga",
      coloring: "Pewarna sintetis dengan ketahanan warna tinggi, sesuai dengan standar industri",
      careInstructions: "Cuci lembut, jemur di tempat teduh."
    }
  },
  {
    id: 6,
    name: "Custom Mix Design Kenanga & Parang",
    description: "Perpaduan unik motif khas Batik Kenanga dengan elemen klasik Parang, menciptakan desain eksklusif yang kuat dan anggun. Pilihan warna dapat disesuaikan.",
    price: 950000,
    category: "custom-design",
    imageUrl: "/images/batik6.jpg",
    rating: 4.9,
    stock: 5, 
    featured: false,
    colors: ["merah", "pink", "abstrak"],
    capPatterns: ["budaya", "flora"],
    tiedyePatterns: ["kerut"],
    details: {
      material: "Sutra Crepe",
      size: "2.6m x 1.15m",
      technique: "Batik Tulis Halus",
      origin: "Workshop Batik Kenanga",
      coloring: "Pewarna alam dan sintetis, kombinasi untuk menghasilkan warna yang kaya dan mendalam",
      careInstructions: "Dry clean sangat direkomendasikan untuk menjaga kehalusan sutra dan warna.",
      images: [
        {
          url: "/images/batikdetail1.jpg",
          caption: "Detail motif kenanga"
        },
        {
          url: "/images/batikdetail2.jpg",
          caption: "Detail motif parang"
        },
        {
          url: "/images/batikdetail3.jpg",
          caption: "Proses pencantingan"
        }
      ],      stampingTools: [
        {
          name: "Cap Kenanga Klasik",
          url: "/images/cap_kenanga1.jpg",
          description: "Cap tembaga motif kenanga ukuran 20x20cm",
          usageArea: "Motif utama"
        },
        {
          name: "Cap Parang Rusak",
          url: "/images/cap_kenanga2.jpg",
          description: "Cap tembaga motif parang ukuran 15x25cm",
          usageArea: "Motif pendukung"
        }
      ]
    }
  },
  {
    id: 7,
    name: "Custom Mix Design Modern Abstrak",
    description: "Desain batik abstrak modern yang terinspirasi dari elemen alam, dikombinasikan dengan teknik pewarnaan gradasi khas Batik Kenanga. Untuk Anda yang berjiwa dinamis.",
    price: 880000,
    category: "custom-design",
    imageUrl: "/images/batik7.jpg",
    rating: 4.7,
    stock: 7,
    featured: false,
    colors: ["abstrak"],
    capPatterns: ["abstrak", "fauna"],
    tiedyePatterns: ["kelereng"],
    details: {
      material: "Katun Primisima Mercerized",
      size: "2.5m x 1.15m",
      technique: "Batik Lukis Kombinasi Tulis",
      origin: "Workshop Batik Kenanga",
      coloring: "Pewarna sintetis dengan teknik gradasi untuk efek visual yang menarik",
      careInstructions: "Cuci tangan dengan hati-hati, gunakan sampo. Jangan disikat."
    }
  },
  {
    id: 8,
    name: "Batik Kenanga Eksklusif Ungu Anggrek",
    description: "Motif anggrek bulan yang anggun dalam nuansa ungu mewah, ditenun dengan benang emas halus. Pilihan tepat untuk acara formal dan koleksi pribadi.",
    price: 1250000,
    category: "batik-kenanga-collection",
    imageUrl: "/images/batik8.jpg",
    rating: 5.0,
    stock: 3,
    featured: false,
    colors: ["pink"],
    capPatterns: ["flora"],
    tiedyePatterns: [],
    details: {
      material: "Sutra Baron",
      size: "2.7m x 1.15m",
      technique: "Batik Tulis Halus dengan Detail Prada",
      origin: "Solo, Indonesia",
      coloring: "Pewarna alam dari bunga anggrek dan daun jati, ditambah detail prada untuk kesan mewah",
      careInstructions: "Hanya dry clean. Hindari paparan parfum langsung ke kain."
    }
  }
];
