import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, ShieldCheck, Scroll, Users, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products as allProducts } from '@/data/productData';
import { categories as allCategories } from '@/data/categoryData';
import { companyInfo } from '@/data/companyData';

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center overflow-hidden bg-secondary">
        <video
          autoPlay
          loop
          src={companyInfo.heroVideo}
          alt="company hero video"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold leading-tight text-primary mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Batik Kenanga
        </motion.h1>
        <motion.p
          className="font-playfair-display text-2xl md:text-3xl text-foreground mb-10 max-w-3xl mx-auto"
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
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild size="lg" className="font-montserrat font-semibold text-lg bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
            <Link to="/products">Lihat Koleksi</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="font-montserrat font-semibold text-lg text-primary border-primary hover:bg-primary/10 hover:text-primary px-8 py-3">
            <Link to="/about">Tentang Kami</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const CompanyProfileSection = () => {
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
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary mb-4">Profil Singkat Batik Kenanga</h2>
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
              <img  alt="Proses pembuatan Batik Kenanga" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1666578296079-52024f45d962" />
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
  const featuredProducts = allProducts.filter(product => product.featured).slice(0, 10);
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    const element = scrollRef.current;
    if (element) {
      const scrollAmount = direction === 'left' 
        ? -element.offsetWidth / 3 
        : element.offsetWidth / 3;
      
      element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary">Produk Unggulan</h2>
            <p className="font-lora text-lg text-muted-foreground mt-2">Koleksi batik terbaik dari Batik Kenanga</p>
          </div>
          <Button asChild variant="link" className="mt-4 md:mt-0 text-primary font-montserrat font-semibold hover:text-primary/80">
            <Link to="/products" className="flex items-center text-lg">
              Lihat Semua Koleksi <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="relative group">
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none mx-4 px-4 scroll-smooth"
            style={{ 
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            <div className="flex gap-10 my-4">
              {featuredProducts.map(product => (
                <div 
                  key={product.id} 
                  className="w-[calc(100%/3-1rem)] flex-shrink-0 snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-background/70"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-background/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-background/70"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
};

const CollectionsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary">Koleksi Batik Kenanga</h2>
          <p className="font-lora text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Temukan berbagai pilihan batik untuk setiap kebutuhan dan identitas Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {allCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Link to={`/products?category=${category.id}`} className="block group">
                <div className="bg-card rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end">
                      <h3 className="text-primary-foreground font-montserrat font-semibold text-2xl p-6">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <p className="font-lora text-muted-foreground text-base line-clamp-3">{category.description}</p>
                  </div>
                  <div className="p-6 pt-0">
                     <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-montserrat">Lihat Koleksi</Button>
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
  const getIcon = (iconName) => {
    switch (iconName) {
      case "Palette": return <Palette className="h-8 w-8 text-primary" />;
      case "ShieldCheck": return <ShieldCheck className="h-8 w-8 text-primary" />;
      case "Scroll": return <Scroll className="h-8 w-8 text-primary" />;
      case "Users": return <Users className="h-8 w-8 text-primary" />;
      default: return null;
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/30 relative">
      <div className="absolute inset-0 batik-bg-pattern"></div>
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-montserrat font-bold text-primary">Mengapa Memilih Batik Kenanga</h2>
          <p className="font-lora text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Dedikasi kami untuk kualitas, otentisitas, dan kepuasan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {companyInfo.whyChooseUs.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-lg text-center border border-transparent hover:border-primary transition-all"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-xl font-montserrat font-semibold mb-3 text-foreground">{item.title}</h3>
              <p className="font-lora text-muted-foreground text-base leading-relaxed">{item.description}</p>
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
