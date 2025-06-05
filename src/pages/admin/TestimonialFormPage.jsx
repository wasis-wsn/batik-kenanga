import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Star, Upload, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../components/ui/use-toast';
import { getTestimonialById, createTestimonial, updateTestimonial, uploadFile } from '../../services/supabase';

const TestimonialFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_location: '',
    customer_image: '',
    message: '',
    product_name: '',
    rating: 5,
    is_featured: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial();
    }
  }, [id, isEdit]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const testimonial = await getTestimonialById(id);
      setFormData({
        customer_name: testimonial.customer_name || '',
        customer_email: testimonial.customer_email || '',
        customer_location: testimonial.customer_location || '',
        customer_image: testimonial.customer_image || '',
        message: testimonial.message || '',
        product_name: testimonial.product_name || '',
        rating: testimonial.rating || 5,
        is_featured: testimonial.is_featured || false,
      });
      setImagePreview(testimonial.customer_image || '');
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonial",
        variant: "destructive",
      });
      navigate('/admin/testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
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

  const uploadImage = async () => {
    if (!imageFile) return formData.customer_image;

    try {
      setImageUploading(true);
      const fileName = `testimonials/${Date.now()}-${imageFile.name}`;
      const imageUrl = await uploadFile(imageFile, fileName);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return formData.customer_image;
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.customer_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Message is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.rating < 1 || formData.rating > 5) {
      toast({
        title: "Validation Error",
        description: "Rating must be between 1 and 5",
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

      // Upload image if a new one was selected
      const imageUrl = await uploadImage();

      const testimonialData = {
        ...formData,
        customer_image: imageUrl,
      };

      if (isEdit) {
        await updateTestimonial(id, testimonialData);
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
      } else {
        await createTestimonial(testimonialData);
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
      }

      navigate('/admin/testimonials');
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} testimonial`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 cursor-pointer transition-colors ${
                star <= formData.rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
        </span>
      </div>
    );
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
          onClick={() => navigate('/admin/testimonials')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update testimonial information' : 'Create a new customer testimonial'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Customer Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      placeholder="Enter customer name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Customer Email</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange}
                      placeholder="customer@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_location">Customer Location</Label>
                  <Input
                    id="customer_location"
                    name="customer_location"
                    value={formData.customer_location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Details */}
            <Card>
              <CardHeader>
                <CardTitle>Testimonial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">                <div className="space-y-2">
                  <Label htmlFor="message">Testimonial Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter the customer's testimonial message..."
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    placeholder="Product that customer is reviewing (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating *</Label>
                  {renderStarRating()}
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="is_featured">Featured Testimonial</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured" className="text-sm">
                      {formData.is_featured ? 'Featured on homepage' : 'Regular testimonial'}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Photo */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Customer"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview('');
                        setImageFile(null);
                        setFormData(prev => ({ ...prev, customer_image: '' }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Photo</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <p className="text-sm text-blue-600">Uploading image...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/testimonials')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving || imageUploading}>
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? 'Update Testimonial' : 'Create Testimonial'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialFormPage;
