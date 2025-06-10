import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { ArrowLeft, Edit, Star, Package, MapPin, Palette, Scissors, Droplets } from 'lucide-react';

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ colors: [], cap_patterns: [], tiedye_patterns: [] });

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productData, filtersData] = await Promise.all([
        productService.getProductById(id),
        productService.getAllFilters()
      ]);
      setProduct(productData);
      setFilters(filtersData);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product',
        variant: 'destructive',
      });
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  // Helper functions to get filter names - handle both ID and name formats
  const getColorName = (colorId) => {
    // If it's already a name (string), return it
    if (typeof colorId === 'string' && !colorId.includes('-')) {
      return colorId;
    }
    // Otherwise, look up by ID
    const color = filters.colors.find(c => c.id === colorId);
    return color ? color.name : colorId;
  };

  const getCapPatternName = (patternId) => {
    // If it's already a name (string), return it
    if (typeof patternId === 'string' && !patternId.includes('-')) {
      return patternId;
    }
    // Otherwise, look up by ID
    const pattern = filters.cap_patterns.find(p => p.id === patternId);
    return pattern ? pattern.name : patternId;
  };

  const getTiedyePatternName = (patternId) => {
    // If it's already a name (string), return it
    if (typeof patternId === 'string' && !patternId.includes('-')) {
      return patternId;
    }
    // Otherwise, look up by ID
    const pattern = filters.tiedye_patterns.find(p => p.id === patternId);
    return pattern ? pattern.name : patternId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Product not found</p>
        <Button onClick={() => navigate('/admin/products')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {product.featured && (
            <Badge variant="default">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          <Link to={`/admin/products/${product.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg font-semibold">{product.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Slug</label>
                  <p className="text-lg">{product.slug || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Price</label>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(product.price)}</p>
                </div>                <div>
                  <label className="text-sm font-medium text-gray-500">Stock</label>
                  <div className="text-lg">
                    <Badge variant={product.stock < 5 ? 'destructive' : 'default'}>
                      {product.stock} units
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Category</label>
                  <div className="text-lg">
                    <Badge variant="outline">
                      {product.categories?.name || 'No Category'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2">
                    {product.featured && (
                      <Badge variant="default">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {product.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-700">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {product.material && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Palette className="mr-1 h-4 w-4" />
                      Material
                    </label>
                    <p className="text-lg">{product.material}</p>
                  </div>
                )}
                {product.size && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Size</label>
                    <p className="text-lg">{product.size}</p>
                  </div>
                )}
                {product.technique && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Scissors className="mr-1 h-4 w-4" />
                      Technique
                    </label>
                    <p className="text-lg">{product.technique}</p>
                  </div>
                )}
                {product.origin && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      Origin
                    </label>
                    <p className="text-lg">{product.origin}</p>
                  </div>
                )}
                {product.coloring && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center">
                      <Droplets className="mr-1 h-4 w-4" />
                      Coloring Process
                    </label>
                    <p className="text-lg">{product.coloring}</p>
                  </div>
                )}
              </div>

              {product.care_instructions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Care Instructions</label>
                  <p className="mt-1 text-gray-700">{product.care_instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors, Patterns */}
          {(product.colors?.length > 0 || product.cap_patterns?.length > 0 || product.tiedye_patterns?.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Colors & Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                {product.colors?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Colors</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.colors.map((color, index) => (
                        <Badge key={index} variant="secondary">{getColorName(color)}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.cap_patterns?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cap Patterns</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.cap_patterns.map((pattern, index) => (
                        <Badge key={index} variant="secondary">{getCapPatternName(pattern)}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.tiedye_patterns?.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tie-dye Patterns</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {product.tiedye_patterns.map((pattern, index) => (
                        <Badge key={index} variant="secondary">{getTiedyePatternName(pattern)}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Stamping Tools */}
          {product.stamping_tools?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Stamping Tools</CardTitle>
                <CardDescription>Tools used for creating this batik</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {product.stamping_tools.map((tool, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      {(tool.imageUrl || tool.url) && (
                        <img
                          src={tool.imageUrl || tool.url}
                          alt={tool.name}
                          className="h-16 w-16 object-cover rounded border"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{tool.name}</h4>
                        {tool.description && (
                          <p className="text-gray-600 text-sm">{tool.description}</p>
                        )}
                        {tool.usageArea && (
                          <p className="text-gray-500 text-xs">Usage: {tool.usageArea}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Main Image */}
          <Card>
            <CardHeader>
              <CardTitle>Main Image</CardTitle>
            </CardHeader>
            <CardContent>
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Images */}
          {product.product_images?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {product.product_images.map((image, index) => (
                    <div key={index} className="space-y-1">
                      <img
                        src={image.url}
                        alt={image.caption || `Product image ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      {image.caption && (
                        <p className="text-xs text-gray-500 truncate">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
