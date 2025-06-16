import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { productService } from '@/services/productService';
import { formatCurrency } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { useToast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    try {
      setIsLoading(true);
      
      // Load the specific product and all products for related products
      const [productData, allProductsData] = await Promise.all([
        productService.getProductById(id),
        productService.getAllProducts()
      ]);
      
      setProduct(productData);
      setAllProducts(allProductsData);
      
      // Find related products (same category, excluding current product)
      if (productData) {
        const related = allProductsData
          .filter(p => 
            p.category_id === productData.category_id && 
            p.id !== productData.id
          )
          .slice(0, 3);
        
        setRelatedProducts(related);
      }
      
      // Reset quantity when product changes
      setQuantity(1);
      
      // Scroll to top when product changes
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h2>
        <p className="text-muted-foreground mb-6">Maaf, produk yang Anda cari tidak tersedia.</p>
        <Button asChild>
          <Link to="/products">Kembali ke Produk</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="bg-secondary/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Beranda</Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-primary">Produk</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={product.image_url || '/images/batik1.jpg'} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
              {product.featured && (
                <div className="absolute top-4 right-4 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                  Unggulan
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali ke Produk
              </Link>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {/* Price */}
              <div className="text-2xl font-bold text-primary mb-4">
                {formatCurrency(product.price)} / M
              </div>
              
              {/* Description */}
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
              
              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Jumlah:</p>
                <div className="flex items-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="mb-8">
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Tambahkan ke Keranjang
                </Button>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-sm">Pengiriman Cepat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm">Garansi Kualitas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  <span className="text-sm">Pengembalian Mudah</span>
                </div>
              </div>
                {/* Categories */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Kategori: <Link to={`/products?category=${product.categories?.slug || product.category_id}`} className="text-primary hover:underline">{product.categories?.name || 'Category'}</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-4 mb-8">
              <TabsTrigger value="details">Detail Produk</TabsTrigger>
              <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
              <TabsTrigger value="process">Proses Pembuatan</TabsTrigger>
              <TabsTrigger value="care">Perawatan</TabsTrigger>
            </TabsList>

            {/* Detail Tab */}
            <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Detail Produk</h3>
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
                {/* Detail Images */}
              {product.product_images && product.product_images.length > 0 && (
                <div className="space-y-6">
                  <h4 className="font-medium text-lg mb-4">Detail Motif</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.product_images.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.caption || `Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          {image.caption || `Product image ${index + 1}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Spesifikasi</h3>
              <div className="space-y-4">                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Bahan</p>
                    <p className="font-medium">{product.material || 'Katun Primisima'}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Ukuran</p>
                    <p className="font-medium">{product.size || '2.4m x 1.15m'}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Teknik</p>
                    <p className="font-medium">{product.technique || 'Batik Tulis'}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Asal</p>
                    <p className="font-medium">{product.origin || 'Solo, Indonesia'}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Pewarnaan</p>
                    <p className="font-medium">{product.coloring || 'Pewarna alam tradisional'}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Proses Pembuatan</h3>
                {product.stamping_tools && product.stamping_tools.length > 0 ? (
                <div className="space-y-6">
                  <h4 className="font-medium text-lg mb-4">Alat Cap yang Digunakan</h4>                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.stamping_tools.map((tool, index) => (
                      <div 
                        key={index}
                        className="flex space-x-4 bg-secondary/30 p-4 rounded-lg"
                      >
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={tool.imageUrl || tool.url || '/images/cap_kenanga1.jpg'}
                            alt={tool.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="space-y-2">
                          <h5 className="font-medium">{tool.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                          <p className="text-sm">
                            <span className="text-primary font-medium">Penggunaan: </span>
                            {tool.usageArea}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-primary font-medium">Catatan: </span>
                      Untuk batik cap kombinasi, setiap alat cap digunakan secara cermat dan berurutan untuk menghasilkan motif yang sempurna.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Produk ini dibuat dengan teknik batik tulis tradisional tanpa menggunakan cap.
                </p>
              )}
            </TabsContent>

            {/* Care Tab */}
            <TabsContent value="care" className="bg-white p-6 rounded-lg shadow-md">              <h3 className="text-xl font-semibold mb-4">Petunjuk Perawatan</h3>
              <p className="text-muted-foreground mb-4">
                {product.care_instructions || 'Cuci dengan tangan menggunakan air dingin dan deterjen lembut. Jangan menggunakan pemutih. Jemur di tempat teduh.'}
              </p>
              <div className="space-y-2 mt-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-semibold text-xs">1</span>
                  </div>
                  <p className="text-muted-foreground">Cuci dengan tangan menggunakan air dingin dan deterjen lembut.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-semibold text-xs">2</span>
                  </div>
                  <p className="text-muted-foreground">Jangan menggunakan pemutih atau bahan kimia keras lainnya.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-semibold text-xs">3</span>
                  </div>
                  <p className="text-muted-foreground">Jemur di tempat teduh dan hindari paparan sinar matahari langsung.</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                    <span className="text-primary font-semibold text-xs">4</span>
                  </div>
                  <p className="text-muted-foreground">Setrika dengan suhu rendah hingga sedang dan gunakan kain pelindung.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
