
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import ContactPage from '@/pages/ContactPage';
import CostumerPage from '@/pages/CostumerPage';
// import NewsPage from '@/pages/NewsPage';
import { CartProvider } from '@/contexts/CartContext';

function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/costumers" element={<CostumerPage />} />
          {/* <Route path="/news" element={<NewsPage />} /> */}
        </Routes>
        <Toaster />
      </Layout>
    </CartProvider>
  );
}

export default App;
