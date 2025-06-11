import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Users, ShoppingBag, Award, Factory } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAllTestimonials, getFeaturedTestimonials } from '../services/supabase';

const TestimonialGrid = ({ testimonials }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-lg shadow-lg overflow-hidden"
        >
          <div className="aspect-video">
            <img
              src={testimonial.image_url || '/images/batik1.jpg'}
              alt={testimonial.product_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-montserrat font-semibold">
                {testimonial.customer_name}
              </h3>
              <span className="text-sm text-muted-foreground">
                {testimonial.year}
              </span>
            </div>
            <p className="text-sm text-primary mb-3">
              {testimonial.product_name}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {testimonial.feedback}
            </p>
            
            {/* Display colors if available */}
            {testimonial.colors && testimonial.colors.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500">Colors:</span>
                <div className="flex gap-1">
                  {testimonial.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const CostumerPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const [allTestimonials, featured] = await Promise.all([
        getAllTestimonials(),
        getFeaturedTestimonials()
      ]);
      setTestimonials(allTestimonials);
      setFeaturedTestimonials(featured);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === featuredTestimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => 
      prev === 0 ? featuredTestimonials.length - 1 : prev - 1
    );
  };

  const filterTestimonials = (category) => {
    if (category === 'all') {
      return testimonials;
    }
    return testimonials.filter(item => item.category === category);
  };

  // Get unique categories from testimonials
  const categories = ['all', ...new Set(testimonials.map(t => t.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary">
        <div className="absolute inset-0 batik-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
              Galeri <span className="text-primary">Pelanggan</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Kisah sukses dan testimoni dari pelanggan setia Batik Kenanga
            </p>
          </motion.div>
        </div>
      </section>

      {/* Custom Design Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-montserrat font-bold mb-4">
              Custom <span className="text-primary">Design</span> Guide
            </h2>
            <p className="text-muted-foreground">
              Kami membantu Anda mewujudkan batik sesuai identitas brand dengan memperhatikan detail setiap elemen desain
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Original Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <h3 className="font-montserrat font-semibold mb-4">Brand Anda</h3>
                <div className="aspect-video bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                  <img
                    src="/images/sample-logo.jpeg"
                    alt="Sample Brand Logo"
                    className="max-h-24"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#ef1c23]" />
                    <span className="text-sm text-muted-foreground">Primary Red</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#64748b]" />
                    <span className="text-sm text-muted-foreground">Secondary Gray</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Process */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <h3 className="font-montserrat font-semibold mb-4">Proses Adaptasi</h3>
                <div className="space-y-4">
                  <div className="aspect-video bg-secondary/30 rounded-lg p-4">
                    <div className="flex flex-col h-full justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#ef1c23]" />
                          <span className="text-sm text-muted-foreground">≈ 85% match</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#64748b]" />
                          <span className="text-sm text-muted-foreground">≈ 90% match</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        *Pewarnaan alami dapat menghasilkan variasi warna
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tim desainer kami akan mengadaptasi warna brand Anda ke dalam palet warna batik yang paling mendekati
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <h3 className="font-montserrat font-semibold mb-4">Hasil Akhir</h3>
                <div className="aspect-video bg-secondary/30 rounded-lg overflow-hidden mb-4">
                  <img
                    src="/images/custom-result.jpeg"
                    alt="Custom Batik Result"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Batik custom yang menggabungkan identitas brand dengan keindahan tradisional
                </p>
              </div>
            </motion.div>
          </div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 rounded-lg p-6 max-w-3xl mx-auto"
          >
            <h4 className="font-montserrat font-medium text-primary mb-3">
              Catatan Penting
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Hasil pewarnaan batik dapat bervariasi 10-20% dari warna yang diminta karena proses pewarnaan alami
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Setiap batch produksi mungkin memiliki sedikit perbedaan warna karena sifat pewarna alami
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Kami akan mengirimkan sampel warna untuk persetujuan sebelum produksi massal dimulai
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonial Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="relative">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >              {/* Image Section */}
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={featuredTestimonials.length > 0 ? 
                      (featuredTestimonials[activeTestimonial].image_url || '/images/batik1.jpg') : 
                      '/images/batik1.jpg'
                    }
                    alt={featuredTestimonials.length > 0 ? 
                      featuredTestimonials[activeTestimonial].product_name : 
                      'Loading...'
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="font-montserrat font-semibold text-lg">
                    {featuredTestimonials.length > 0 ? 
                      featuredTestimonials[activeTestimonial].product_name : 
                      'Loading...'
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {featuredTestimonials.length > 0 ? 
                      `${featuredTestimonials[activeTestimonial].customer_name} • ${featuredTestimonials[activeTestimonial].year}` :
                      'Loading...'
                    }
                  </p>
                </div>
              </div>

              {/* Testimonial Content */}            <div className="bg-card p-8 rounded-lg shadow-lg">
                {featuredTestimonials.length > 0 ? (
                  <>
                    <blockquote className="text-lg text-muted-foreground mb-6">
                      "{featuredTestimonials[activeTestimonial].feedback}"
                    </blockquote>

                    {/* Color Information Section */}
                    <div className="mb-6">
                      <h4 className="font-montserrat font-medium text-foreground mb-3">
                        Logo & Warna Yang Digunakan
                      </h4>
                      <div className="flex items-start gap-8">
                        {/* Logo Section */}
                        {featuredTestimonials[activeTestimonial].logo_url && (
                          <div className="w-32 flex-shrink-0">
                            <div className="aspect-square bg-secondary/30 rounded-lg p-4 flex items-center justify-center">
                              <img
                                src={featuredTestimonials[activeTestimonial].logo_url}
                                alt={`Logo ${featuredTestimonials[activeTestimonial].customer_name}`}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                              Logo Original
                            </p>
                          </div>
                        )}

                        {/* Colors Section */}
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            {featuredTestimonials[activeTestimonial].colors?.map((color, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className="w-8 h-8 rounded-full border border-border"
                                  style={{ backgroundColor: color.hex }}
                                />
                                <span className="text-xs text-muted-foreground mt-1">
                                  {color.name}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">
                            *Warna yang digunakan dalam produk batik
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No featured testimonials available</p>
                )}                {/* Printing Information Section */}
                {featuredTestimonials.length > 0 && (
                  <>
                    <div className="flex gap-6 items-start">
                      {featuredTestimonials[activeTestimonial].printing_method?.image && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={featuredTestimonials[activeTestimonial].printing_method.image}
                            alt="Teknik Cetak"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-montserrat font-medium text-foreground mb-2">
                          Teknik Pencetakan
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {featuredTestimonials[activeTestimonial].printing_method?.description || 'Teknik batik tradisional dengan kualitas premium'}
                        </p>
                      </div>
                    </div>

                    {/* Result Batik Section */}
                    {featuredTestimonials[activeTestimonial].image_gallery && featuredTestimonials[activeTestimonial].image_gallery.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        {featuredTestimonials[activeTestimonial].image_gallery.map((img, index) => (
                          <div key={index} className="aspect-square rounded-md overflow-hidden">
                            <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-primary" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-primary mb-4">
              Ulasan Pelanggan
            </h2>
            <p className="text-lg text-muted-foreground">
              Apa kata mereka tentang Batik Kenanga
            </p>
          </div>          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
              {categories.slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category === 'all' ? 'Semua' : 
                   category === 'corporate' ? 'Korporat' :
                   category === 'custom' ? 'Custom' :
                   category === 'retail' ? 'Retail' :
                   category === 'community' ? 'Komunitas' :
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <TestimonialGrid testimonials={filterTestimonials(category)} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-lg text-center"
            >
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <p className="text-sm text-muted-foreground">Total Pelanggan</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-lg text-center"
            >
              <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">1000+</div>
              <p className="text-sm text-muted-foreground">Produk Terjual</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-lg text-center"
            >
              <Award className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">4.9</div>
              <p className="text-sm text-muted-foreground">Rating Kepuasan</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-lg shadow-lg text-center"
            >
              <Factory className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">25+</div>
              <p className="text-sm text-muted-foreground">Tahun Pengalaman</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CostumerPage;