
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('batikEleganceCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('batikEleganceCart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('batikEleganceCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        
        toast({
          title: "Produk ditambahkan",
          description: `${product.name} ditambahkan ke keranjang.`,
          duration: 3000,
        });
        
        return updatedItems;
      } else {
        toast({
          title: "Produk ditambahkan",
          description: `${product.name} ditambahkan ke keranjang.`,
          duration: 3000,
        });
        
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      
      if (itemToRemove) {
        toast({
          title: "Produk dihapus",
          description: `${itemToRemove.name} dihapus dari keranjang.`,
          duration: 3000,
        });
      }
      
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua produk telah dihapus dari keranjang.",
      duration: 3000,
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
