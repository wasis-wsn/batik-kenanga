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
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsPage from '@/pages/TermsPage';
import { CartProvider } from '@/contexts/CartContext';
import ErrorBoundary from '@/components/ui/error-boundary';

// Admin Components
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

// Admin Pages
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminSetupPage from '@/pages/admin/AdminSetupPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ProductsManagementPage from '@/pages/admin/ProductsManagementPage';
import ProductFormPage from '@/pages/admin/ProductFormPage';
import ProductViewPage from '@/pages/admin/ProductViewPage';
import CategoriesManagementPage from '@/pages/admin/CategoriesManagementPage';
import CategoryFormPage from '@/pages/admin/CategoryFormPage';
import NewsManagementPage from '@/pages/admin/NewsManagementPage';
import NewsFormPage from '@/pages/admin/NewsFormPage';
import TestimonialsManagementPage from '@/pages/admin/TestimonialsManagementPage';
import TestimonialFormPage from '@/pages/admin/TestimonialFormPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import UserFormPage from '@/pages/admin/UserFormPage';
import CompanyInfoPage from '@/pages/admin/CompanyInfoPage';
import MediaLibraryPage from '@/pages/admin/MediaLibraryPage';
import SettingsPage from '@/pages/admin/SettingsPage';

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <CartProvider>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/cart" element={<Layout><CartPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/costumers" element={<Layout><CostumerPage /></Layout>} />
          <Route path="/news" element={<Layout><NewsPage /></Layout>} />
          <Route path="/news/:slug" element={<Layout><NewsDetailPage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/terms" element={<Layout><TermsPage /></Layout>} />          {/* Admin Login and Setup Routes (Public) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/setup" element={<AdminSetupPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  {/* Dashboard */}
                  <Route path="/" element={<AdminDashboardPage />} />
                  <Route path="/dashboard" element={<AdminDashboardPage />} />                  {/* Products Management */}
                  <Route path="/products" element={<ProductsManagementPage />} />
                  <Route path="/products/new" element={<ProductFormPage />} />
                  <Route path="/products/:id" element={<ProductViewPage />} />
                  <Route path="/products/:id/edit" element={<ProductFormPage />} />

                  {/* Categories Management */}
                  <Route path="/categories" element={<CategoriesManagementPage />} />
                  <Route path="/categories/new" element={<CategoryFormPage />} />
                  <Route path="/categories/:id/edit" element={<CategoryFormPage />} />

                  {/* News Management */}
                  <Route path="/news" element={<NewsManagementPage />} />
                  <Route path="/news/new" element={<NewsFormPage />} />
                  <Route path="/news/:id/edit" element={<NewsFormPage />} />

                  {/* Testimonials Management */}
                  <Route path="/testimonials" element={<TestimonialsManagementPage />} />
                  <Route path="/testimonials/new" element={<TestimonialFormPage />} />
                  <Route path="/testimonials/:id/edit" element={<TestimonialFormPage />} />

                  {/* User Management */}
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/users/new" element={<UserFormPage />} />
                  <Route path="/users/:id/edit" element={<UserFormPage />} />

                  {/* Company & Settings */}
                  <Route path="/company" element={<CompanyInfoPage />} />
                  <Route path="/media" element={<MediaLibraryPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />        </Routes>
        <Toaster />
      </CartProvider>
    </AdminAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
