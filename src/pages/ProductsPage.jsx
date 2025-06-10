import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { useToast } from '@/components/ui/use-toast';

const FilterSidebar = ({ 
  activeCategory, 
  searchTerm, 
  priceRange,
  activeColors,
  activeCapPatterns,
  activeTiedyePatterns,
  allCategories,
  allColors,
  allCapPatterns,
  allTiedyePatterns,
  handleCategoryChange, 
  handleSearchChange, 
  handlePriceChange,
  handleColorChange,
  handleCapPatternChange,
  handleTiedyePatternChange,
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

      <Accordion type="multiple" className="w-full space-y-4">
        <AccordionItem value="colors" className="border-none">
          <AccordionTrigger className="font-montserrat font-medium text-foreground hover:no-underline">
            Warna
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {allColors.map(color => (
                <div key={color.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color.id}`}
                    checked={activeColors.includes(color.id)}
                    onCheckedChange={() => handleColorChange(color.id)}
                  />
                  <label
                    htmlFor={`color-${color.id}`}
                    className="text-sm font-lora text-muted-foreground cursor-pointer"
                  >
                    {color.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="capPatterns" className="border-none">
          <AccordionTrigger className="font-montserrat font-medium text-foreground hover:no-underline">
            Motif Cap
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {allCapPatterns.map(pattern => (
                <div key={pattern.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cap-${pattern.id}`}
                    checked={activeCapPatterns.includes(pattern.id)}
                    onCheckedChange={() => handleCapPatternChange(pattern.id)}
                  />
                  <label
                    htmlFor={`cap-${pattern.id}`}
                    className="text-sm font-lora text-muted-foreground cursor-pointer"
                  >
                    {pattern.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tiedyePatterns" className="border-none">
          <AccordionTrigger className="font-montserrat font-medium text-foreground hover:no-underline">
            Motif Tie Dye
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {allTiedyePatterns.map(pattern => (
                <div key={pattern.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tiedye-${pattern.id}`}
                    checked={activeTiedyePatterns.includes(pattern.id)}
                    onCheckedChange={() => handleTiedyePatternChange(pattern.id)}
                  />
                  <label
                    htmlFor={`tiedye-${pattern.id}`}
                    className="text-sm font-lora text-muted-foreground cursor-pointer"
                  >
                    {pattern.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6">
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

const HeroCarousel = ({ featuredProducts = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const featuredImages = featuredProducts
    .filter(product => product.featured && product.image_url)
    .map(product => product.image_url);

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
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');

  // Data states
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [allCapPatterns, setAllCapPatterns] = useState([]);
  const [allTiedyePatterns, setAllTiedyePatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeColors, setActiveColors] = useState([]);
  const [activeCapPatterns, setActiveCapPatterns] = useState([]);
  const [activeTiedyePatterns, setActiveTiedyePatterns] = useState([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [products, categories, filters] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories(),
        productService.getAllFilters()
      ]);
      
      setAllProducts(products);
      setAllCategories(categories);
      setAllColors(filters.colors || []);
      setAllCapPatterns(filters.cap_patterns || []);
      setAllTiedyePatterns(filters.tiedye_patterns || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let updatedProducts = [...allProducts];

    // Category filter
    if (activeCategory !== 'all') {
      updatedProducts = updatedProducts.filter(product => {
        // Handle special category logic for legacy data structure compatibility
        if (activeCategory === 'batik-kenanga-collection') {
          return product.colors?.length === 1 && product.cap_patterns?.length === 1 && (!product.tiedye_patterns || product.tiedye_patterns.length === 0);
        } else if (activeCategory === 'custom-color') {
          return product.colors?.length > 1;
        } else if (activeCategory === 'custom-design') {
          return product.colors?.length > 1 || product.cap_patterns?.length > 1 || (product.tiedye_patterns && product.tiedye_patterns.length > 0);
        }
        // Standard category filtering by category_id or slug
        return product.category_id === activeCategory || product.categories?.slug === activeCategory;
      });
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      updatedProducts = updatedProducts.filter(
        product => 
          product.name.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term)
      );
    }

    // Price range filter
    updatedProducts = updatedProducts.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Color filter
    if (activeColors.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        product.colors?.some(color => activeColors.includes(color))
      );
    }

    // Cap pattern filter
    if (activeCapPatterns.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        product.cap_patterns?.some(pattern => activeCapPatterns.includes(pattern))
      );
    }

    // Tie-dye pattern filter
    if (activeTiedyePatterns.length > 0) {
      updatedProducts = updatedProducts.filter(product =>
        product.tiedye_patterns?.some(pattern => activeTiedyePatterns.includes(pattern))
      );
    }

    setFilteredProducts(updatedProducts);
  }, [allProducts, activeCategory, searchTerm, priceRange, activeColors, activeCapPatterns, activeTiedyePatterns]);

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
  
  const handleColorChange = (colorId) => {
    setActiveColors(prev => 
      prev.includes(colorId) 
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
  };

  const handleCapPatternChange = (patternId) => {
    setActiveCapPatterns(prev => 
      prev.includes(patternId)
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    );
  };

  const handleTiedyePatternChange = (patternId) => {
    setActiveTiedyePatterns(prev => 
      prev.includes(patternId)
        ? prev.filter(id => id !== patternId)
        : [...prev, patternId]
    );
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchTerm('');
    setPriceRange([0, 10000000]);
    setActiveColors([]);
    setActiveCapPatterns([]);
    setActiveTiedyePatterns([]);
    const params = new URLSearchParams(location.search);
    params.delete('category');
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };
  const toggleFilters = () => setShowFilters(!showFilters);

  if (loading) {
    return (
      <div className="bg-background font-lora">
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-lora">
      <HeroCarousel featuredProducts={allProducts} />

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
                activeColors={activeColors}
                activeCapPatterns={activeCapPatterns}
                activeTiedyePatterns={activeTiedyePatterns}
                allCategories={allCategories}
                allColors={allColors}
                allCapPatterns={allCapPatterns}
                allTiedyePatterns={allTiedyePatterns}
                handleCategoryChange={handleCategoryChange}
                handleSearchChange={handleSearchChange}
                handlePriceChange={handlePriceChange}
                handleColorChange={handleColorChange}
                handleCapPatternChange={handleCapPatternChange}
                handleTiedyePatternChange={handleTiedyePatternChange}
                handleResetFilters={handleResetFilters}
              />
            </motion.div>

            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-border">
                <p className="text-muted-foreground font-lora mb-2 sm:mb-0">
                  Menampilkan {filteredProducts.length} dari {allProducts.length} produk
                </p>
                <div className="flex items-center space-x-2 flex-wrap">                  {activeCategory !== 'all' && (
                    <div className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      {allCategories.find(cat => cat.id === activeCategory || cat.slug === activeCategory)?.name || activeCategory}
                      <button onClick={() => handleCategoryChange('all')} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {activeColors.map(colorId => (
                    <div key={colorId} className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      {allColors.find(c => c.id === colorId)?.name || colorId}
                      <button onClick={() => handleColorChange(colorId)} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {activeCapPatterns.map(patternId => (
                    <div key={patternId} className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      {allCapPatterns.find(p => p.id === patternId)?.name || patternId}
                      <button onClick={() => handleCapPatternChange(patternId)} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {activeTiedyePatterns.map(patternId => (
                    <div key={patternId} className="bg-primary/10 text-primary text-sm py-1.5 px-3 rounded-full flex items-center font-lora">
                      {allTiedyePatterns.find(p => p.id === patternId)?.name || patternId}
                      <button onClick={() => handleTiedyePatternChange(patternId)} className="ml-2 focus:outline-none">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
                {activeCategory !== 'all' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-secondary/30 rounded-lg p-4 mb-8"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-16 h-16 mr-4 overflow-hidden rounded-lg">
                      <img 
                        src={allCategories.find(cat => cat.id === activeCategory || cat.slug === activeCategory)?.image_url || '/images/batik_koleksi.jpg'}
                        alt={allCategories.find(cat => cat.id === activeCategory || cat.slug === activeCategory)?.name || activeCategory}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-lg mb-1">
                        {allCategories.find(cat => cat.id === activeCategory || cat.slug === activeCategory)?.name || activeCategory}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {allCategories.find(cat => cat.id === activeCategory || cat.slug === activeCategory)?.description || 'Category description'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <ProductGrid products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
