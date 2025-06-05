import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingCard } from '@/components/ui/loading';
import { 
  getAllProducts, 
  getAllNews, 
  getAllTestimonials 
} from '@/services/supabase';
import {
  Package,
  FileText,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  ShoppingCart,
  Star,
  Plus,
} from 'lucide-react';

const StatCard = ({ title, value, description, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md ${colorClasses[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {trend && (
            <span className="inline-flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {trend}
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

const QuickActionCard = ({ title, description, href, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'hover:bg-blue-50 border-blue-200',
    green: 'hover:bg-green-50 border-green-200',
    purple: 'hover:bg-purple-50 border-purple-200',
    orange: 'hover:bg-orange-50 border-orange-200',
  };

  return (
    <Link to={href}>
      <Card className={`transition-colors cursor-pointer ${colorClasses[color]}`}>
        <CardContent className="flex items-center p-6">
          <div className="mr-4">
            <Icon className="h-8 w-8 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const RecentItem = ({ title, subtitle, href, date }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <div>
      <Link to={href} className="font-medium text-gray-900 hover:text-blue-600">
        {title}
      </Link>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <span className="text-xs text-gray-400">{date}</span>
  </div>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    products: 0,
    news: 0,
    testimonials: 0,
    featuredProducts: 0,
  });
  const [recentData, setRecentData] = useState({
    products: [],
    news: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
        // Load stats
      const [products, news, testimonials] = await Promise.all([
        getAllProducts(),
        getAllNews(),
        getAllTestimonials(),
      ]);

      setStats({
        products: products.length,
        news: news.length,
        testimonials: testimonials.length,
        featuredProducts: products.filter(p => p.featured).length,
      });

      // Load recent data
      setRecentData({
        products: products.slice(0, 5),
        news: news.slice(0, 5),
        testimonials: testimonials.slice(0, 5),
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };  if (loading) {
    return (
      <LoadingCard 
        title="Loading Dashboard..." 
        description="Getting the latest statistics and activity data."
      />
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Batik Kenanga Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.products}
            description="Active products"
            icon={Package}
            color="blue"
          />
          <StatCard
            title="Featured Products"
            value={stats.featuredProducts}
            description="Featured items"
            icon={Star}
            color="green"
          />
          <StatCard
            title="News Articles"
            value={stats.news}
            description="Published articles"
            icon={FileText}
            color="purple"
          />
          <StatCard
            title="Testimonials"
            value={stats.testimonials}
            description="Customer reviews"
            icon={MessageSquare}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickActionCard
              title="Add Product"
              description="Create a new product"
              href="/admin/products/new"
              icon={Plus}
              color="blue"
            />
            <QuickActionCard
              title="Write Article"
              description="Publish news article"
              href="/admin/news/new"
              icon={FileText}
              color="green"
            />
            <QuickActionCard
              title="Manage Media"
              description="Upload and organize files"
              href="/admin/media"
              icon={Eye}
              color="purple"
            />
            <QuickActionCard
              title="View Settings"
              description="Configure system settings"
              href="/admin/settings"
              icon={Users}
              color="orange"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Products
                <Link to="/admin/products">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData.products.map((product) => (
                  <RecentItem
                    key={product.id}
                    title={product.name}
                    subtitle={`Rp ${product.price.toLocaleString('id-ID')}`}
                    href={`/admin/products/${product.id}`}
                    date={formatDate(product.created_at)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent News
                <Link to="/admin/news">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData.news.map((article) => (
                  <RecentItem
                    key={article.id}
                    title={article.title}
                    subtitle={article.category}
                    href={`/admin/news/${article.id}`}
                    date={formatDate(article.created_at)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Testimonials
                <Link to="/admin/testimonials">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentData.testimonials.map((testimonial) => (
                  <RecentItem
                    key={testimonial.id}
                    title={testimonial.customer_name}
                    subtitle={testimonial.product_name}
                    href={`/admin/testimonials/${testimonial.id}`}
                    date={formatDate(testimonial.created_at)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>        </div>
      </div>
    );
  };

  export default AdminDashboardPage;
