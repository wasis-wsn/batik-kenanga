import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllNews, getNewsBySlug } from '../services/supabase';
import '../styles/news-content.css';

const NewsDetailPage = () => {
  const { slug } = useParams();
  const [currentNews, setCurrentNews] = useState(null);
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsData();
  }, [slug]);

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const [newsData, allNewsData] = await Promise.all([
        getNewsBySlug(slug),
        getAllNews({ status: 'published' })
      ]);
      setCurrentNews(newsData);
      setAllNews(allNewsData);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!currentNews) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h2>
        <Button asChild>
          <Link to="/news">Kembali ke Berita</Link>
        </Button>
      </div>
    );
  }

  const currentIndex = allNews.findIndex(item => item.slug === slug);
  const prevNews = currentIndex > 0 ? allNews[currentIndex - 1] : null;
  const nextNews = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null;
  const recentNews = allNews
    .filter(item => item.id !== currentNews.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  return (
    <div className="bg-background">      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={currentNews.image_url || '/images/batik1.jpg'}
          alt={currentNews.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3"
            >
              <Link
                to="/news"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Berita
              </Link>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {currentNews.category}
                </span>                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(currentNews.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-montserrat font-bold mb-6">
                {currentNews.title}
              </h1>              
              <div className="news-content mb-8"
                dangerouslySetInnerHTML={{ __html: currentNews.content }}
              />
              {/* Image Gallery */}              
              {currentNews.related_images && currentNews.related_images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {currentNews.related_images.map((image, index) => (
                    <div key={`related-image-${currentNews.id}-${index}`} className="aspect-video rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`Related-image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {currentNews.tags.map(tag => (
                  <span
                    key={tag}
                    className="bg-secondary text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center border-t border-border pt-8">
                {prevNews ? (
                  <Link
                    to={`/news/${prevNews.slug}`}
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <div>
                      <div className="text-sm">Sebelumnya</div>
                      <div className="font-medium">{prevNews.title}</div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextNews && (
                  <Link
                    to={`/news/${nextNews.slug}`}
                    className="flex items-center text-right text-muted-foreground hover:text-primary"
                  >
                    <div>
                      <div className="text-sm">Selanjutnya</div>
                      <div className="font-medium">{nextNews.title}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="sticky top-24">
                {/* Share */}
                <div className="bg-card p-6 rounded-lg shadow-md mb-8">
                  <h3 className="font-montserrat font-semibold mb-4 flex items-center">
                    <Share2 className="h-5 w-5 mr-2" />
                    Bagikan
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full">
                      Facebook
                    </Button>
                    <Button variant="outline" className="w-full">
                      Twitter
                    </Button>
                    <Button variant="outline" className="w-full">
                      WhatsApp
                    </Button>
                  </div>
                </div>

                {/* Recent News */}
                <div className="bg-card p-6 rounded-lg shadow-md">
                  <h3 className="font-montserrat font-semibold mb-4">
                    Berita Terbaru
                  </h3>
                  <div className="space-y-4">
                    {recentNews.map(item => (
                      <Link
                        key={item.id}
                        to={`/news/${item.slug}`}
                        className="flex gap-4 group"
                      >                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image_url || '/images/batik1.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <div className="text-sm text-muted-foreground mt-1">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetailPage;