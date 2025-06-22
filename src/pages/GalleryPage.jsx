import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, Eye, Download, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { mediaLibraryService } from '@/services/mediaLibraryService';

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const files = await mediaLibraryService.getAllMediaFiles();
      // Filter only gallery files from documents bucket
      const galleryFiles = files.filter(file => file.bucket_name === 'documents');
      setGalleryItems(galleryFiles || []);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.original_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.alt_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.caption?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'galeri', label: 'Galeri' },
    { value: 'produk', label: 'Produk' },
    { value: 'proses', label: 'Proses' },
    { value: 'tim', label: 'Tim' },
    { value: 'event', label: 'Event' }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'gallery-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={`gallery-skeleton-${i}`} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-secondary">
        <div className="absolute inset-0 batik-pattern opacity-10"></div>
        <img
          src="/images/batik_cap.jpg"
          alt="batik cap"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">
              Galeri <span className="text-primary">Batik Kenanga</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Koleksi foto karya dan proses pembuatan batik kami
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari foto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Tidak ada foto yang ditemukan.</p>
            </div>
          ) : (
            <TooltipProvider>
              {viewMode === 'grid' ? (
                /* Masonry Grid Layout */
                <div className="masonry-grid columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="masonry-item"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                            <div className="relative group" onClick={() => openModal(item)}>
                              <img
                                src={item.url}
                                alt={item.alt_text || item.original_name}
                                className="w-full h-auto object-cover"
                              />
                              
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="icon"
                                    variant="secondary"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{item.alt_text || item.original_name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-64 aspect-video md:aspect-square relative group cursor-pointer" onClick={() => openModal(item)}>
                            <img
                              src={item.url}
                              alt={item.alt_text || item.original_name}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Overlay for list view */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="secondary"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <CardContent className="flex-1 p-6">
                            <div className="space-y-3">
                              {/* Alt Text as Title */}
                              <h3 className="font-semibold text-lg">
                                {item.alt_text || 'Gambar Batik'}
                              </h3>
                              
                              {/* Description */}
                              {item.caption && (
                                <p className="text-muted-foreground">
                                  {item.caption}
                                </p>
                              )}
                              
                              {/* Tags */}
                              {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {item.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              
                              {/* Meta Info */}
                              <div className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(item.created_at)}
                                </div>
                                
                                {item.category && (
                                  <Badge variant="secondary">
                                    {item.category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TooltipProvider>
          )}

          {/* Stats */}
          {filteredItems.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Menampilkan {filteredItems.length} dari {galleryItems.length} foto
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedItem?.alt_text || selectedItem?.original_name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <>
              {/* Full Image Display */}
              <div className="relative group">
                <div className="max-h-[70vh] overflow-hidden rounded-lg">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt_text || selectedItem.original_name}
                    className="w-full h-auto object-contain"
                  />
                </div>
                
                {/* Download Button Overlay */}
                <div className="absolute top-4 right-4">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-black/50 hover:bg-black/70 text-white border-0"
                    onClick={() => downloadImage(selectedItem.url, selectedItem.original_name)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Image Information */}
              <div className="space-y-4 pt-4 border-t">
                {/* Alt Text / Title */}
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedItem.alt_text || 'Gambar Batik'}
                  </h3>
                </div>

                {/* Category */}
                {selectedItem.category && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Kategori:</h4>
                    <Badge variant="secondary" className="capitalize">
                      {selectedItem.category}
                    </Badge>
                  </div>
                )}
                
                {/* Caption */}
                {selectedItem.caption && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">Deskripsi:</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.caption}</p>
                  </div>
                )}
                
                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Upload Date */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <Calendar className="h-3 w-3" />
                  <span>Diunggah pada {formatDate(selectedItem.created_at)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
