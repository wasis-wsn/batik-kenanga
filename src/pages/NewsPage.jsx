import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { news } from '@/data/newsData';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [...new Set(news.map(item => item.category))];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
              Berita <span className="text-primary">Terkini</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Temukan informasi terbaru seputar Batik Kenanga dan dunia batik
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="sticky top-24">
                {/* Search */}
                <div className="mb-8">
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Cari berita..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-card p-6 rounded-lg shadow-md">
                  <h3 className="font-montserrat font-semibold mb-4">Kategori</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeCategory === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeCategory === category ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* News Grid */}
            <div className="lg:w-3/4">
              <div className="grid gap-8">
                {filteredNews.map((item) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/news/${item.slug}`} className="flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover aspect-video md:aspect-square"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(item.date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <h2 className="text-xl font-montserrat font-semibold mb-2 text-foreground">
                          {item.title}
                        </h2>
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center text-primary font-medium">
                          Baca selengkapnya <ChevronRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsPage;