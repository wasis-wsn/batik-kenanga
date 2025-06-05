import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { 
  getAllCategories,
  getProductById,
  createProduct,
  updateProduct,
  uploadFile
} from '@/services/supabase';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    rating: 0,
    stock: 0,
    featured: false,
    colors: [],
    cap_patterns: [],
    tiedye_patterns: [],
    material: '',
    size: '',
    technique: '',
    origin: '',
    coloring: '',
    care_instructions: '',
    stamping_tools: [],
  });

  const [colorInput, setColorInput] = useState('');
  const [capPatternInput, setCapPatternInput] = useState('');
  const [tiedyePatternInput, setTiedyePatternInput] = useState('');
  const [stampingToolInput, setStampingToolInput] = useState('');

  const colorOptions = ['biru', 'merah', 'hijau', 'orange', 'pink', 'abstrak'];
  const capPatternOptions = ['budaya', 'abstrak', 'geometris'];
  const tiedyePatternOptions = ['spiral', 'gradasi', 'tie-dye'];

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [id, isEditing]);
  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };
  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await getProductById(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        image_url: product.image_url || '',
        rating: product.rating || 0,
        stock: product.stock || 0,
        featured: product.featured || false,
        colors: product.colors || [],
        cap_patterns: product.cap_patterns || [],
        tiedye_patterns: product.tiedye_patterns || [],
        material: product.material || '',
        size: product.size || '',
        technique: product.technique || '',
        origin: product.origin || '',
        coloring: product.coloring || '',
        care_instructions: product.care_instructions || '',
        stamping_tools: product.stamping_tools || [],
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating),
        stock: parseInt(formData.stock),
      };

      if (isEditing) {
        await db.updateProduct(id, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await db.createProduct(productData);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addToArray = (field, value, setInputValue) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setInputValue('');
    }
  };

  const removeFromArray = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addColorOption = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const addCapPatternOption = (pattern) => {
    if (!formData.cap_patterns.includes(pattern)) {
      setFormData(prev => ({
        ...prev,
        cap_patterns: [...prev.cap_patterns, pattern]
      }));
    }
  };

  const addTiedyePatternOption = (pattern) => {
    if (!formData.tiedye_patterns.includes(pattern)) {
      setFormData(prev => ({
        ...prev,
        tiedye_patterns: [...prev.tiedye_patterns, pattern]
      }));
    }
  };
  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/products')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : 'Create a new product for your catalog'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details of your product
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="price">Price (IDR)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="0"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category_id}
                        onChange={(e) => handleInputChange('category_id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => handleInputChange('rating', e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="/images/product.jpg"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Additional product specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => handleInputChange('material', e.target.value)}
                        placeholder="e.g., Katun Primisima"
                      />
                    </div>

                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                        placeholder="e.g., 2.4m x 1.15m"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="technique">Technique</Label>
                      <Input
                        id="technique"
                        value={formData.technique}
                        onChange={(e) => handleInputChange('technique', e.target.value)}
                        placeholder="e.g., Batik Tulis"
                      />
                    </div>

                    <div>
                      <Label htmlFor="origin">Origin</Label>
                      <Input
                        id="origin"
                        value={formData.origin}
                        onChange={(e) => handleInputChange('origin', e.target.value)}
                        placeholder="e.g., Solo, Indonesia"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="coloring">Coloring Process</Label>
                    <Textarea
                      id="coloring"
                      value={formData.coloring}
                      onChange={(e) => handleInputChange('coloring', e.target.value)}
                      placeholder="Describe the coloring process"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="care_instructions">Care Instructions</Label>
                    <Textarea
                      id="care_instructions"
                      value={formData.care_instructions}
                      onChange={(e) => handleInputChange('care_instructions', e.target.value)}
                      placeholder="How to care for this product"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={formData.colors.includes(color) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => addColorOption(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      placeholder="Custom color"
                      size="sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addToArray('colors', colorInput, setColorInput)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        <span>{color}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('colors', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cap Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle>Cap Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {capPatternOptions.map((pattern) => (
                      <Button
                        key={pattern}
                        type="button"
                        variant={formData.cap_patterns.includes(pattern) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => addCapPatternOption(pattern)}
                      >
                        {pattern}
                      </Button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={capPatternInput}
                      onChange={(e) => setCapPatternInput(e.target.value)}
                      placeholder="Custom pattern"
                      size="sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addToArray('cap_patterns', capPatternInput, setCapPatternInput)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.cap_patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        <span>{pattern}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('cap_patterns', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tie-dye Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle>Tie-dye Patterns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {tiedyePatternOptions.map((pattern) => (
                      <Button
                        key={pattern}
                        type="button"
                        variant={formData.tiedye_patterns.includes(pattern) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => addTiedyePatternOption(pattern)}
                      >
                        {pattern}
                      </Button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      value={tiedyePatternInput}
                      onChange={(e) => setTiedyePatternInput(e.target.value)}
                      placeholder="Custom pattern"
                      size="sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addToArray('tiedye_patterns', tiedyePatternInput, setTiedyePatternInput)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.tiedye_patterns.map((pattern, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        <span>{pattern}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('tiedye_patterns', index)}
                          className="h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stamping Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Stamping Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      value={stampingToolInput}
                      onChange={(e) => setStampingToolInput(e.target.value)}
                      placeholder="Add stamping tool"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addToArray('stamping_tools', stampingToolInput, setStampingToolInput)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {formData.stamping_tools.map((tool, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded"
                      >
                        <span className="text-sm">{tool}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('stamping_tools', index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>        </form>
      </div>
    );
  };

  export default ProductFormPage;
