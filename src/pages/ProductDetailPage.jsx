import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { products as allProducts } from '@/data/productData';
import { formatCurrency } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // Find the product by id
    const foundProduct = allProducts.find(p => p.id === parseInt(id));
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find related products (same category, excluding current product)
      const related = allProducts
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 3);
      
      setRelatedProducts(related);
    }
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    // Reset quantity when product changes
    setQuantity(1);
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

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
            >
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={product.imageUrl} 
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
                {formatCurrency(product.price)}
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
                  Kategori: <Link to={`/products?category=${product.category}`} className="text-primary hover:underline">{product.category.replace('-', ' ')}</Link>
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
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              <TabsTrigger value="details">Detail Produk</TabsTrigger>
              <TabsTrigger value="specifications">Spesifikasi</TabsTrigger>
              <TabsTrigger value="care">Perawatan</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Detail Produk</h3>
              <p className="text-muted-foreground mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground">
                Batik ini dibuat dengan teknik {product.details.technique} yang membutuhkan ketelitian tinggi dan waktu pembuatan yang cukup lama. Setiap motif memiliki makna filosofis yang dalam dan mencerminkan kekayaan budaya Indonesia.
              </p>
            </TabsContent>
            <TabsContent value="specifications" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Spesifikasi</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Bahan</p>
                    <p className="font-medium">{product.details.material}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Ukuran</p>
                    <p className="font-medium">{product.details.size}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Teknik</p>
                    <p className="font-medium">{product.details.technique}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Asal</p>
                    <p className="font-medium">{product.details.origin}</p>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Pewarnaan</p>
                    <p className="font-medium">{product.details.coloring}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="care" className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Petunjuk Perawatan</h3>
              <p className="text-muted-foreground mb-4">
                {product.details.careInstructions}
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
