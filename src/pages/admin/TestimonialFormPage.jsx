import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Image, Building2, FileImage, Plus } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../components/ui/use-toast';
import { 
  getTestimonialById, 
  createTestimonial, 
  updateTestimonial, 
  uploadTestimonialMainImage,
  uploadTestimonialGalleryImage,
  uploadTestimonialLogo,
  uploadTestimonialPrintingMethod
} from '../../services/supabase';

const TestimonialFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileUploading, setFileUploading] = useState({
    main: false,
    logo: false,
    printing: false,
    gallery: [false, false, false]
  });  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_location: '',
    category: '',
    product_name: '',
    year: new Date().getFullYear(),
    image_url: '',
    feedback: '',
    image_gallery: [],
    logo_url: '',
    colors: [],
    printing_method: {
      image: '',
      description: ''
    },
    is_featured: false
  });

  const [files, setFiles] = useState({
    mainImage: null,
    logo: null,
    printing: null,
    gallery: [null, null, null]
  });

  const [previews, setPreviews] = useState({
    mainImage: '',
    logo: '',
    printing: '',
    gallery: ['', '', '']
  });

  useEffect(() => {
    if (isEdit) {
      fetchTestimonial();
    }
  }, [id, isEdit]);

  const fetchTestimonial = async () => {
    try {
      setLoading(true);
      const testimonial = await getTestimonialById(id);      setFormData({
        customer_name: testimonial.customer_name || '',
        customer_email: testimonial.customer_email || '',
        customer_location: testimonial.customer_location || '',
        image_url: testimonial.image_url || '',
        feedback: testimonial.feedback || '',
        product_name: testimonial.product_name || '',
        category: testimonial.category || '',
        year: testimonial.year || new Date().getFullYear(),
        is_featured: testimonial.is_featured || false,
        image_gallery: testimonial.image_gallery || [],
        logo_url: testimonial.logo_url || '',
        colors: testimonial.colors || [],
        printing_method: (() => {
          const pm = testimonial.printing_method;
          if (!pm) return { image: '', description: '' };
          if (typeof pm === 'string') {
            // Handle legacy data that is just a URL string
            return { image: pm, description: '' };
          }
          if (typeof pm === 'object') {
            return {
              image: pm.image || '',
              description: pm.description || ''
            };
          }
          return { image: '', description: '' };
        })()
      });      // Set existing previews
      setPreviews({
        mainImage: testimonial.image_url || '',
        logo: testimonial.logo_url || '',
        printing: (() => {
          const pm = testimonial.printing_method;
          if (!pm) return '';
          if (typeof pm === 'string') return pm;
          if (typeof pm === 'object') return pm.image || '';
          return '';
        })(),
        gallery: [
          testimonial.image_gallery?.[0] || '',
          testimonial.image_gallery?.[1] || '',
          testimonial.image_gallery?.[2] || ''
        ]
      });
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonial data",
        variant: "destructive",
      });
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

  const handleFileChange = (type, index = null) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Set file and preview
    if (type === 'gallery') {
      const newFiles = [...files.gallery];
      newFiles[index] = file;
      setFiles(prev => ({ ...prev, gallery: newFiles }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPreviews = [...previews.gallery];
        newPreviews[index] = e.target.result;
        setPreviews(prev => ({ ...prev, gallery: newPreviews }));
      };
      reader.readAsDataURL(file);
    } else {
      setFiles(prev => ({ ...prev, [type]: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type, index = null) => {
    if (type === 'gallery') {
      const newFiles = [...files.gallery];
      newFiles[index] = null;
      setFiles(prev => ({ ...prev, gallery: newFiles }));

      const newPreviews = [...previews.gallery];
      newPreviews[index] = '';
      setPreviews(prev => ({ ...prev, gallery: newPreviews }));
    } else {
      setFiles(prev => ({ ...prev, [type]: null }));
      setPreviews(prev => ({ ...prev, [type]: '' }));
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

    if (!formData.feedback.trim()) {
      toast({
        title: "Validation Error",
        description: "Testimonial feedback is required",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const uploadFiles = async (testimonialId) => {    const uploadedUrls = {
      image_url: formData.image_url,
      image_gallery: [...formData.image_gallery],
      logo_url: formData.logo_url,
      printing_method: formData.printing_method,
      colors: formData.colors
    };

    try {
      // Upload main image
      if (files.mainImage) {
        setFileUploading(prev => ({ ...prev, main: true }));
        uploadedUrls.image_url = await uploadTestimonialMainImage(testimonialId, files.mainImage);
      }

      // Upload logo
      if (files.logo) {
        setFileUploading(prev => ({ ...prev, logo: true }));
        uploadedUrls.logo_url = await uploadTestimonialLogo(testimonialId, files.logo);
      }      // Upload printing method image
      if (files.printing) {
        setFileUploading(prev => ({ ...prev, printing: true }));
        const url = await uploadTestimonialPrintingMethod(testimonialId, files.printing);
        uploadedUrls.printing_method = {
          image: url,
          description: formData.printing_method.description || ''
        };
      } else {
        // Always ensure printing_method is an object structure
        uploadedUrls.printing_method = {
          image: formData.printing_method?.image || '',
          description: formData.printing_method?.description || ''
        };
      }

      // Upload gallery images
      for (let i = 0; i < files.gallery.length; i++) {
        if (files.gallery[i]) {
          setFileUploading(prev => ({
            ...prev,
            gallery: prev.gallery.map((status, idx) => idx === i ? true : status)
          }));
          const url = await uploadTestimonialGalleryImage(testimonialId, files.gallery[i], i + 1);
          uploadedUrls.image_gallery[i] = url;
        }
      }      return uploadedUrls;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setFileUploading({
        main: false,
        logo: false,
        printing: false,
        gallery: [false, false, false]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      let testimonialId = id;
      let uploadedUrls = {};

      if (isEdit) {
        // Update existing testimonial
        await updateTestimonial(id, formData);
        
        // Upload new files if any
        uploadedUrls = await uploadFiles(id);
        
        // Update with new URLs
        if (Object.keys(uploadedUrls).length > 0) {
          await updateTestimonial(id, uploadedUrls);
        }
      } else {
        // Create new testimonial
        const newTestimonial = await createTestimonial(formData);
        testimonialId = newTestimonial.id;
        
        // Upload files
        uploadedUrls = await uploadFiles(testimonialId);
        
        // Update with file URLs
        if (Object.keys(uploadedUrls).length > 0) {
          await updateTestimonial(testimonialId, uploadedUrls);
        }
      }

      toast({
        title: "Success",
        description: `Testimonial ${isEdit ? 'updated' : 'created'} successfully`,
      });

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


  const renderFileUpload = (type, label, icon, index = null) => {
    const preview = type === 'gallery' ? previews.gallery[index] : previews[type];
    const isUploading = type === 'gallery' ? fileUploading.gallery[index] : fileUploading[type];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt={label}
              className="w-full h-32 object-cover rounded-md border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1"
              onClick={() => removeFile(type, index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange(type, index)}
            className="hidden"
            id={`${type}-${index || 'input'}`}
            disabled={isUploading}
          />
          <Label
            htmlFor={`${type}-${index || 'input'}`}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {icon}
            <span className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : `Upload ${label}`}
            </span>
          </Label>
        </div>
      </div>
    );
  };
  const addColor = () => {
    if (formData.colors.length < 3) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { hex: '#000000', name: 'Warna Baru' }]
      }));
    }
  };

  const updateColor = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      colors: newColors
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handlePrintingMethodDescriptionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      printing_method: {
        ...prev.printing_method,
        description: e.target.value
      }
    }));
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
                  <Label htmlFor="feedback">Testimonial Feedback *</Label>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    placeholder="Enter the customer's testimonial feedback..."
                    rows={6}
                    required
                  />
                </div><div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input
                    id="product_name"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    placeholder="Product that customer is reviewing (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="corporate">Corporate</option>
                      <option value="custom">Custom</option>
                      <option value="community">Community</option>
                      <option value="retail">Retail</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleInputChange}
                      min="2020"
                      max={new Date().getFullYear()}
                      placeholder="Year of testimonial"
                    />
                  </div>
                </div>              </CardContent>
            </Card>

            {/* Image Gallery */}
            <Card>
              <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
                <p className="text-sm text-gray-600">Upload up to 3 images</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                  {[0, 1, 2].map((index) => (
                    <div key={`gallery-upload-${index}`}>
                      {renderFileUpload('gallery', `Image ${index + 1}`, <Image className="h-8 w-8 text-gray-400" />, index)}
                    </div>
                  ))}
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
              <CardContent>
                {renderFileUpload('mainImage', 'Customer Photo', <Upload className="h-8 w-8 text-gray-400" />)}
              </CardContent>
            </Card>

            {/* Company Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
              </CardHeader>
              <CardContent>
                {renderFileUpload('logo', 'Company Logo', <Building2 className="h-8 w-8 text-gray-400" />)}
              </CardContent>
            </Card>

            {/* Printing Method */}
            <Card>
              <CardHeader>
                <CardTitle>Printing Method</CardTitle>
              </CardHeader>
              <CardContent>
                {renderFileUpload('printing', 'Technique Image', <FileImage className="h-8 w-8 text-gray-400" />)}
              </CardContent>
            </Card>            {/* Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Colors</CardTitle>
                <p className="text-sm text-gray-600">Select up to 3 colors</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">                  {formData.colors.map((colorObj, index) => (
                    <div key={`color-${index}-${colorObj.hex}`} className="flex items-center gap-3 p-3 border rounded-lg">
                      <input
                        type="color"
                        value={colorObj.hex}
                        onChange={(e) => updateColor(index, 'hex', e.target.value)}
                        className="w-12 h-12 p-0 border-0 rounded-md cursor-pointer"
                      />
                      <div className="flex-1">
                        <Input
                          placeholder="Nama warna"
                          value={colorObj.name}
                          onChange={(e) => updateColor(index, 'name', e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeColor(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {formData.colors.length < 3 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColor}
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Tambah Warna
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Printing Method Description */}
            <Card>
              <CardHeader>
                <CardTitle>Printing Method Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.printing_method.description}
                  onChange={handlePrintingMethodDescriptionChange}
                  placeholder="Enter a description for the printing method..."
                  rows={3}
                />
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
          <Button 
            type="submit" 
            disabled={saving || Object.values(fileUploading).some(status => 
              Array.isArray(status) ? status.some(s => s) : status
            )}
          >
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
