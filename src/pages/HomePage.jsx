import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, ShieldCheck, Scroll, Users, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';
import { useToast } from '@/components/ui/use-toast';

const HeroSection = () => {
  const { companyInfo } = useCompanyInfo();
  
  if (!companyInfo) return null;
    return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden bg-secondary">
        <video
          autoPlay
          loop
          muted
          playsInline
          src="/videos/video_batik_kenanga.mp4"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>      <div className="relative z-10 container mx-auto px-4 py-16 md:py-20 lg:py-32">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold leading-tight text-primary mb-4 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {companyInfo.name}
        </motion.h1>
        <motion.p
          className="font-playfair-display text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground mb-8 md:mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {companyInfo.tagline} - Wujudkan Identitas Anda Bersama Kami.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="font-montserrat font-semibold text-base sm:text-lg bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 w-full sm:w-auto">
            <Link to="/products">Lihat Koleksi</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-montserrat font-semibold text-base sm:text-lg text-primary border-primary hover:bg-primary/10 hover:text-primary px-6 sm:px-8 py-3 w-full sm:w-auto">
            <Link to="/about">Tentang Kami</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const CompanyProfileSection = () => {
  const { companyInfo } = useCompanyInfo();
  
  if (!companyInfo) return null;
  
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary mb-4">Bring Up Your Identity</h2>
            <p className="font-playfair-display text-xl text-foreground mb-6">{companyInfo.tagline}</p>
            <p className="font-lora text-lg text-muted-foreground mb-6 leading-relaxed">
              {companyInfo.profileSingkat}
            </p>
            <Button asChild variant="link" className="text-primary font-montserrat font-semibold hover:text-primary/80 pl-0">
              <Link to="/about" className="flex items-center">
                Pelajari Lebih Lanjut <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-2xl aspect-[4/3]">
              <img  alt="Proses pembuatan Batik Kenanga" className="w-full h-full object-cover" src={companyInfo.profileImage} />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-card p-4 rounded-lg shadow-xl max-w-xs border border-secondary">
                <div className="flex items-center space-x-2 text-primary font-semibold font-montserrat">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Kualitas Otentik Terjaga</span>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturedProductsSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const scrollRef = React.useRef(null);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      const products = await productService.getAllProducts({ featured: true, limit: 10 });
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load featured products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    const element = scrollRef.current;
    if (element) {
      const scrollAmount = direction === 'left' 
        ? -element.offsetWidth / 3 
        : element.offsetWidth / 3;
      
      element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading featured products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-primary">Produk Unggulan</h2>
            <p className="font-lora text-base sm:text-lg text-muted-foreground mt-2">Koleksi batik terbaik dari Batik Kenanga</p>
          </div>
          <Button asChild variant="link" className="text-primary font-montserrat font-semibold hover:text-primary/80 text-center md:text-left">
            <Link to="/products" className="flex items-center text-base sm:text-lg">
              Lihat Semua Koleksi <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none scroll-smooth pb-4"
            style={{ 
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            <div className="flex gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
              {featuredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="w-72 sm:w-80 md:w-96 flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>          
          {/* Navigation Buttons - Hidden on mobile */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center hover:bg-background/90 shadow-lg hidden sm:flex"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center hover:bg-background/90 shadow-lg hidden sm:flex"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

const CollectionsSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Helper function to construct proper category image URL
  const getCategoryImageUrl = (category) => {
    return category.image_url || '/images/batik_koleksi.jpg';
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await productService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">        
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-primary">Koleksi Batik Kenanga</h2>
          <p className="font-lora text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Temukan berbagai pilihan batik untuk setiap kebutuhan dan identitas Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link to={`/products?category=${category.slug || category.id}`} className="block group">                
              <div className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="aspect-video sm:aspect-[4/3] bg-muted relative overflow-hidden">
                    <img 
                      src={getCategoryImageUrl(category)} 
                      alt={category.name} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                      <h3 className="text-primary-foreground font-montserrat font-semibold text-lg sm:text-xl lg:text-2xl p-4 sm:p-6">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex-grow">
                    <p className="font-lora text-muted-foreground text-sm sm:text-base line-clamp-3">{category.description}</p>
                  </div>
                  <div className="p-4 sm:p-6 pt-0">
                     <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-montserrat text-sm sm:text-base">Lihat Koleksi</Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => {
  const { companyInfo } = useCompanyInfo();
  
  if (!companyInfo?.whyChooseUs) return null;
    const getIcon = (iconName) => {
    switch (iconName) {
      case "Palette": return <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case "ShieldCheck": return <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case "Scroll": return <Scroll className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      case "Users": return <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />;
      default: return null;
    }
  };
  return (
    <section className="py-16 lg:py-24 bg-secondary/30 relative">
      <div className="absolute inset-0 batik-bg-pattern"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-montserrat font-bold text-primary">Mengapa Memilih Batik Kenanga</h2>
          <p className="font-lora text-base sm:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Dedikasi kami untuk kualitas, otentisitas, dan kepuasan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {companyInfo.whyChooseUs.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-4 sm:p-6 rounded-lg shadow-lg text-center border border-transparent hover:border-primary transition-all"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 mx-auto">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-lg sm:text-xl font-montserrat font-semibold mb-2 sm:mb-3 text-foreground">{item.title}</h3>
              <p className="font-lora text-muted-foreground text-sm sm:text-base leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


const HomePage = () => {
  return (
    <div className="bg-background">
      <HeroSection />
      <CompanyProfileSection />
      <FeaturedProductsSection />
      <CollectionsSection />
      <WhyChooseUsSection />
    </div>
  );
};

export default HomePage;
