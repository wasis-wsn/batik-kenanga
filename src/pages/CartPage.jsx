
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Pesanan berhasil!",
        description: "Terima kasih telah berbelanja di Batik Elegance.",
        duration: 5000,
      });
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Keranjang Belanja Kosong</h1>
          <p className="text-muted-foreground mb-6">
            Anda belum menambahkan produk apapun ke keranjang belanja.
          </p>
          <Button asChild>
            <Link to="/products">Mulai Belanja</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Produk ({cartItems.length})</h2>
              </div>
              
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 flex flex-col sm:flex-row items-start sm:items-center"
                  >
                    <div className="w-full sm:w-20 h-20 rounded-md overflow-hidden mr-0 sm:mr-4 mb-4 sm:mb-0 flex-shrink-0">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/products/${item.id}`} className="font-medium hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.details.material}, {item.details.size}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold mr-4">{formatCurrency(item.price * item.quantity)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-6 border-t border-border flex justify-between">
                <Button variant="outline" onClick={clearCart}>
                  Kosongkan Keranjang
                </Button>
                <Button asChild variant="outline">
                  <Link to="/products">Lanjutkan Belanja</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Ringkasan Pesanan</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pengiriman</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pajak</span>
                  <span className="font-medium">{formatCurrency(getCartTotal() * 0.1)}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(getCartTotal() * 1.1)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Dengan melakukan checkout, Anda menyetujui syarat dan ketentuan kami.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
