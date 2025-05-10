
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
    >
      <Link to={`/products/${product.id}`} className="h-full flex flex-col">
        <Card className="product-card h-full overflow-hidden border border-border/70 hover:border-primary/70 transition-all duration-300 flex flex-col bg-card">
          <div className="relative aspect-[3/2] overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {product.featured && (
              <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-montserrat font-semibold px-2.5 py-1 rounded-full shadow-md">
                Unggulan
              </div>
            )}
          </div>
          <CardContent className="p-5 flex-grow">
            <h3 className="font-montserrat font-semibold text-lg text-foreground line-clamp-2 mb-1">{product.name}</h3>
            <p className="font-lora text-sm text-muted-foreground mt-1 line-clamp-2 mb-3">{product.description}</p>
            <div className="mt-auto font-montserrat font-bold text-xl text-primary">{formatCurrency(product.price)} / 10 Meter</div> 
          </CardContent>
          <CardFooter className="p-5 pt-0">
            <Button 
              variant="outline"
              className="w-full font-montserrat font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
              onClick={handleAddToCart}
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Tambah ke Keranjang
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
