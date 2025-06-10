import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ colors: [], cap_patterns: [], tiedye_patterns: [] });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);  const [productImageFiles, setProductImageFiles] = useState([]);
  const [stampingToolFiles, setStampingToolFiles] = useState([]);
  const [stampingToolInput, setStampingToolInput] = useState({ name: '', url: '', description: '', usageArea: '', imageFile: null });
  const [productImageInput, setProductImageInput] = useState({ url: '', caption: '' });const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
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
    product_images: [], // array of {url, caption} or {file, caption}
  });
  const [manualSlug, setManualSlug] = useState(false);
  useEffect(() => {
    loadInitialData();
    if (isEditing) {
      loadProduct();
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (!manualSlug && formData.name) {
      setFormData(prev => ({ ...prev, slug: prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }));
    }
  }, [formData.name, manualSlug]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, filtersData] = await Promise.all([
        productService.getAllCategories(),
        productService.getAllFilters()
      ]);
      setCategories(categoriesData);
      setFilters(filtersData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load form data',
        variant: 'destructive',
      });
    }
  };  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productService.getProductById(id);      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        image_url: product.image_url || '',
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
        product_images: product.product_images?.map(img => ({ url: img.url, caption: img.caption })) || [],
      });
      setImagePreview(product.image_url || null);
      setManualSlug(true);
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
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      // Prepare product images data - combine file uploads and URL inputs
      const productImagesData = [
        // File uploads with empty captions
        ...productImageFiles.map(file => ({ file, caption: '' })),
        // URL inputs from formData.product_images
        ...formData.product_images
      ];

      let productId = id;      

      if (isEditing) {
        // Update existing product
        await productService.updateProduct(id, productData, imageFile, productImagesData, formData.stamping_tools);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Create new product
        const newProduct = await productService.createProduct(productData, imageFile, productImagesData, formData.stamping_tools);
        productId = newProduct.id;
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
        description: error.message || 'Failed to save product',
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
    if (field === 'slug') setManualSlug(true);
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

  // Image handling functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: `${file.name} is too large. Maximum size is 5MB`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });
    
    setProductImageFiles(prev => [...prev, ...validFiles]);
  };  const removeProductImageFile = (index) => {
    setProductImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  const handleStampingToolImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setStampingToolInput(prev => ({
        ...prev,
        imageFile: file,
        url: '' // Clear URL when file is selected
      }));
    }
  };
  const removeStampingToolImage = () => {
    setStampingToolInput(prev => ({
      ...prev,
      imageFile: null
    }));
    // Reset file input
    const fileInput = document.getElementById('stamping-tool-image-upload');
    if (fileInput) fileInput.value = '';
  };const addStampingTool = () => {
    if (stampingToolInput.name.trim() && (stampingToolInput.url.trim() || stampingToolInput.imageFile)) {
      const newTool = {
        name: stampingToolInput.name.trim(),
        url: stampingToolInput.url.trim(),
        description: stampingToolInput.description.trim() || '',
        usageArea: stampingToolInput.usageArea.trim() || ''
      };
      
      // If there's an image file, add it to the tool
      if (stampingToolInput.imageFile) {
        newTool.imageFile = stampingToolInput.imageFile;
      }
      
      setFormData(prev => ({
        ...prev,
        stamping_tools: [...prev.stamping_tools, newTool]
      }));      setStampingToolInput({ name: '', url: '', description: '', usageArea: '', imageFile: null });
      
      // Reset file input
      const fileInput = document.getElementById('stamping-tool-image-upload');
      if (fileInput) fileInput.value = '';
    }
  };

  const removeStampingTool = (index) => {
    setFormData(prev => ({
      ...prev,
      stamping_tools: prev.stamping_tools.filter((_, i) => i !== index)
    }));
  };

  const addProductImageUrl = () => {
    if (productImageInput.url.trim()) {
      const newImage = {
        url: productImageInput.url.trim(),
        caption: productImageInput.caption.trim() || ''
      };
      setFormData(prev => ({
        ...prev,
        product_images: [...prev.product_images, newImage]
      }));
      setProductImageInput({ url: '', caption: '' });
    }
  };

  const removeProductImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      product_images: prev.product_images.filter((_, i) => i !== index)
    }));
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
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="Enter product slug"
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
                  </div>                  <div className="grid gap-4 md:grid-cols-2">
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
                  </div><div>
                    <Label>Main Product Image</Label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload').click()}
                          className="flex items-center space-x-2"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Image</span>
                        </Button>
                        <span className="text-sm text-gray-500">
                          or enter URL below
                        </span>
                      </div>
                      
                      <Input
                        placeholder="Enter image URL (optional)"
                        value={formData.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                      />
                      
                      {(imagePreview || formData.image_url) && (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || formData.image_url}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
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
              </Card>              {/* Colors, Cap Patterns, Tiedye Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>
                    Select applicable colors and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Colors</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {filters.colors.map(color => (
                        <label key={color.id} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={formData.colors.includes(color.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addColorOption(color.id);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  colors: prev.colors.filter(c => c !== color.id)
                                }));
                              }
                            }}
                          />
                          <span>{color.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Cap Patterns</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {filters.cap_patterns.map(pattern => (
                        <label key={pattern.id} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={formData.cap_patterns.includes(pattern.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addCapPatternOption(pattern.id);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  cap_patterns: prev.cap_patterns.filter(c => c !== pattern.id)
                                }));
                              }
                            }}
                          />
                          <span>{pattern.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Tiedye Patterns</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                      {filters.tiedye_patterns.map(pattern => (
                        <label key={pattern.id} className="flex items-center space-x-2 text-sm">
                          <Checkbox
                            checked={formData.tiedye_patterns.includes(pattern.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addTiedyePatternOption(pattern.id);
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  tiedye_patterns: prev.tiedye_patterns.filter(c => c !== pattern.id)
                                }));
                              }
                            }}
                          />
                          <span>{pattern.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>              {/* Stamping Tools */}
              <Card>
                <CardHeader>
                  <CardTitle>Stamping Tools</CardTitle>
                  <CardDescription>
                    Tools used for creating this batik
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">                  {/* Add Stamping Tool Form */}
                  <div>
                    <Label>Add Stamping Tool</Label>
                    <div className="space-y-2">
                      <Input
                        value={stampingToolInput.name}
                        onChange={(e) => setStampingToolInput(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter tool name"
                      />
                      
                      {/* Image Upload or URL */}
                      <div className="space-y-2">
                        <Label className="text-sm">Tool Image</Label>                        <div className="flex items-center space-x-2">
                          <Input
                            id="stamping-tool-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleStampingToolImageChange}
                            className="flex-1"
                          />
                          {stampingToolInput.imageFile && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeStampingToolImage}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="text-center text-sm text-gray-500">or</div>
                        <Input
                          value={stampingToolInput.url}
                          onChange={(e) => setStampingToolInput(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="Enter image URL"
                          disabled={!!stampingToolInput.imageFile}
                        />
                      </div>
                      
                      <Input
                        value={stampingToolInput.description}
                        onChange={(e) => setStampingToolInput(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter description"
                      />
                      <Input
                        value={stampingToolInput.usageArea}
                        onChange={(e) => setStampingToolInput(prev => ({ ...prev, usageArea: e.target.value }))}
                        placeholder="Enter usage area"
                      />
                      
                      {/* Image Preview */}
                      {stampingToolInput.imageFile && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(stampingToolInput.imageFile)}
                            alt="Tool preview"
                            className="h-20 w-20 object-cover rounded border"
                          />
                        </div>
                      )}
                      
                      <Button 
                        type="button" 
                        onClick={addStampingTool} 
                        size="sm"
                        disabled={!stampingToolInput.name.trim() || (!stampingToolInput.url.trim() && !stampingToolInput.imageFile)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Tool
                      </Button>
                    </div>
                  </div>
                  
                  {/* Current Stamping Tools */}
                  {formData.stamping_tools.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Tools:</Label>                      {formData.stamping_tools.map((tool, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {/* Tool Image */}
                            {(tool.imageFile || tool.url || tool.imageUrl) && (
                              <img
                                src={tool.imageFile ? URL.createObjectURL(tool.imageFile) : (tool.imageUrl || tool.url)}
                                alt={tool.name}
                                className="h-12 w-12 object-cover rounded border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{tool.name}</div>
                              {tool.url && !tool.imageFile && (
                                <div className="text-xs text-gray-500 truncate">{tool.url}</div>
                              )}
                              {tool.description && (
                                <div className="text-xs text-gray-500">{tool.description}</div>
                              )}
                              {tool.usageArea && (
                                <div className="text-xs text-gray-500">Usage: {tool.usageArea}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStampingTool(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Product Images</CardTitle>
                  <CardDescription>
                    Upload multiple images or add URLs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <Label>Upload Images</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        id="product-images-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleProductImageChange}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('product-images-upload').click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Upload Images</span>
                      </Button>
                    </div>
                    
                    {productImageFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label className="text-sm font-medium">Files to upload:</Label>
                        {productImageFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProductImageFile(index)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* URL Input */}
                  <div>
                    <Label>Add Image URL</Label>
                    <div className="space-y-2">
                      <Input
                        value={productImageInput.url}
                        onChange={(e) => setProductImageInput(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="Enter image URL"
                      />
                      <Input
                        value={productImageInput.caption}
                        onChange={(e) => setProductImageInput(prev => ({ ...prev, caption: e.target.value }))}
                        placeholder="Enter image caption (optional)"
                      />
                      <Button 
                        type="button" 
                        onClick={addProductImageUrl} 
                        size="sm"
                        disabled={!productImageInput.url.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add URL
                      </Button>
                    </div>
                  </div>

                  {/* Current URLs */}
                  {formData.product_images.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current URLs:</Label>
                      {formData.product_images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm truncate">{image.url}</div>
                            {image.caption && (
                              <div className="text-xs text-gray-500">{image.caption}</div>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProductImageUrl(index)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
