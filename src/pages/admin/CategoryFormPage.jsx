import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { categoryService } from '../../services/categoryService';

const CategoryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });
  const [manualSlug, setManualSlug] = useState(false);
  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id, isEdit]);

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!manualSlug && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, manualSlug]);  const fetchCategory = async () => {
    try {
      setLoading(true);
      const category = await categoryService.getCategoryById(id);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image_url: category.image_url || '',
      });
      setImagePreview(category.image_url || null);
      setManualSlug(true); // Mark as manual since we're editing existing
    } catch (error) {
      console.error('Error fetching category:', error);
      toast({
        title: "Error",
        description: "Failed to fetch category",
        variant: "destructive",
      });
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
      // Mark slug as manual if user edits it
    if (name === 'slug') {
      setManualSlug(true);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(isEdit ? formData.image_url : null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.slug.trim()) {
      toast({
        title: "Validation Error",
        description: "Category slug is required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      if (isEdit) {
        await categoryService.updateCategory(id, formData, imageFile);
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        await categoryService.createCategory(formData, imageFile);
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      }

      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} category`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/categories')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update category information' : 'Create a new product category'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="category-slug"
                  required
                />
              </div>            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              <div className="flex flex-col gap-4">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  ref={(input) => {
                    if (input) {
                      input.onclick = () => input.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image').click()}
                  className="w-fit"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
                {imagePreview && (
                  <div className="relative w-48 h-32">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}                <p className="text-sm text-gray-500">
                  Recommended size: 400x300px. Max size: 10MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (Alternative)</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
              />
              <p className="text-sm text-gray-500">
                {imageFile ? 'File upload takes priority over URL' : 'You can either upload a file or provide an image URL'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/categories')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPage;
