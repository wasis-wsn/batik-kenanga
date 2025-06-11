
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Link to={`/products/${product.id}`}>
        <Card className="product-card h-full overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300">
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {product.featured && (
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
                Unggulan
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-2 font-semibold text-foreground">{formatCurrency(product.price)}/10M</div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-primary hover:text-white transition-colors"
              onClick={handleAddToCart}
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
