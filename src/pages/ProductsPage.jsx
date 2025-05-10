import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ProductCard from '@/ProductCard';
import { products as allProducts } from '@/data/productData';
import { categories as allCategories } from '@/data/categoryData';

const FilterSidebar = ({ 
  activeCategory, 
  searchTerm, 
  priceRange, 
  handleCategoryChange, 
  handleSearchChange, 
  handlePriceChange, 
  handleResetFilters 
}) => {
  const priceOptions = [
    { label: "Semua Harga", min: 0, max: 10000000 },
    { label: "Dibawah Rp 500.000", min: 0, max: 499999 },
    { label: "Rp 500.000 - Rp 1.000.000", min: 500000, max: 1000000 },
    { label: "Diatas Rp 1.000.000", min: 1000001, max: 10000000 },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-lg sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-montserrat font-semibold text-primary">Filter</h2>
        <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-sm font-lora text-primary hover:bg-primary/10">
          Reset
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="search" className="mb-2 block font-montserrat text-foreground">Pencarian</Label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder="Cari batik..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 font-lora bg-background"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-montserrat font-medium mb-3 text-foreground">Kategori</h3>
        <div className="space-y-2 font-lora">
          <div 
            className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${activeCategory === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary/50 text-muted-foreground'}`}
            onClick={() => handleCategoryChange('all')}
          >
            Semua Kategori
          </div>
          {allCategories.map(category => (
            <div 
              key={category.id}
              className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${activeCategory === category.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary/50 text-muted-foreground'}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-montserrat font-medium mb-3 text-foreground">Rentang Harga</h3>
        <div className="space-y-2 font-lora">
          {priceOptions.map(option => (
            <div 
              key={option.label}
              className={`cursor-pointer py-2 px-3 rounded-md transition-colors ${priceRange[0] === option.min && priceRange[1] === option.max ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary/50 text-muted-foreground'}`}
              onClick={() => handlePriceChange(option.min, option.max)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 col-span-full">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration: 0.5}}>
          <img  alt="Batik tidak ditemukan" className="w-48 h-48 mx-auto mb-6 opacity-50" src="https://images.unsplash.com/photo-1675923410751-206079534ab5" />
          <h3 className="text-2xl font-montserrat font-semibold mb-2 text-primary">Produk Tidak Ditemukan</h3>
          <p className="font-lora text-lg text-muted-foreground mb-6">
            Maaf, kami tidak dapat menemukan produk yang sesuai dengan kriteria Anda.
          </p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/products">Lihat Semua Produk</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredImages = allProducts
    .filter(product => product.featured)
    .map(product => product.imageUrl);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredImages.length]);

  return (
    <section className="relative h-[300px] md:h-[400px] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 batik-bg-pattern opacity-20 z-10"></div>
      
      {/* Image Carousel */}
      {featuredImages.map((imageUrl, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: currentSlide === index ? 1 : 0,
            scale: currentSlide === index ? 1 : 1.1,
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img
            src={imageUrl}
            alt={`Featured Batik ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </motion.div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Koleksi <span className="text-secondary">Batik Kenanga</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl font-playfair-display text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Jelajahi mahakarya batik tulis, cap, dan kustom untuk setiap momen berharga Anda.
          </motion.p>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {featuredImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let updatedProducts = [...allProducts];

    if (activeCategory !== 'all') {
      updatedProducts = updatedProducts.filter(product => product.category === activeCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      updatedProducts = updatedProducts.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }

    updatedProducts = updatedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    setFilteredProducts(updatedProducts);
  }, [activeCategory, searchTerm, priceRange]);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all'); 
    }
  }, [categoryParam]);


  const handleCategoryChange = (category) => setActiveCategory(category);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePriceChange = (min, max) => setPriceRange([min, max]);
  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setPriceRange([0, 10000000]);
    const params = new URLSearchParams(location.search);
    params.delete('category');
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);

  };
  const toggleFilters = () => setShowFilters(!showFilters);

  return (
    <div className="bg-background font-lora">
      <HeroCarousel />

      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:hidden mb-4">
              <Button onClick={toggleFilters} variant="outline" className="w-full flex items-center justify-center font-montserrat border-primary text-primary hover:bg-primary/10">
                <Filter className="h-5 w-5 mr-2" />
                {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
              </Button>
            </div>

            <motion.div 
              className={`lg:w-1/4 ${showFilters ? 'block animate-accordion-down' : 'hidden'} lg:block`}
              initial={false}
              animate={showFilters || window.innerWidth >= 1024 ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FilterSidebar 
                activeCategory={activeCategory}
                searchTerm={searchTerm}
                priceRange={priceRange}
                handleCategoryChange={handleCategoryChange}
                handleSearchChange={handleSearchChange}
                handlePriceChange={handlePriceChange}
                handleResetFilters={handleResetFilters}
              />
            </motion.div>

            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-border">
                <p className="text-muted-foreground font-lora mb-2 sm:mb-0">
                  Menampilkan {filteredProducts.length} dari {allProducts.length} produk
                </p>
                <div className="flex items-center space-x-2 flex-wrap">
                  {activeCategory !== 'all' && (
                    <div className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      {allCategories.find(cat => cat.id === activeCategory)?.name}
                      <button onClick={() => handleCategoryChange('all')} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {searchTerm && (
                    <div className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
