import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { 
  getNewsById, 
  createNews, 
  updateNews,
  uploadNewsMainImage,
  uploadNewsRelatedImage
} from '../../services/supabase';
import RichTextEditor from '../../components/ui/rich-text-editor';

const NewsFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileUploading, setFileUploading] = useState({
    main: false,
    related: []
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    author: '',
    excerpt: '',
    content: '',
    image_url: '',
    status: 'draft',
    published_at: '',
    meta_title: '',
    meta_description: '',
    tags: [],
    related_images: []
  });

  const [files, setFiles] = useState({
    mainImage: null,
    relatedImages: []
  });

  const [previews, setPreviews] = useState({
    mainImage: '',
    relatedImages: []
  });

  useEffect(() => {
    if (isEdit) {
      fetchNews();
    }
  }, [id, isEdit]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const article = await getNewsById(id);
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        category: article.category || '',
        author: article.author || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        image_url: article.image_url || '',
        status: article.status || 'draft',
        published_at: article.published_at 
          ? new Date(article.published_at).toISOString().split('T')[0] 
          : '',
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        tags: article.tags || [],
        related_images: article.related_images || []
      });
      
      setPreviews({
        mainImage: article.image_url || '',
        relatedImages: article.related_images || []
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news article",
        variant: "destructive",
      });
      navigate('/admin/news');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !isEdit ? { slug: generateSlug(value) } : {})
    }));
  };
  const handleMainImageChange = (e) => {
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
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => ({ ...prev, mainImage: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews(prev => ({ ...prev, mainImage: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRelatedImageChange = (index) => (e) => {
    const file = e.target.files[0];
    if (!file) return;    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    const newFiles = [...files.relatedImages];
    newFiles[index] = file;
    setFiles(prev => ({ ...prev, relatedImages: newFiles }));

    const reader = new FileReader();
    reader.onload = (e) => {
      const newPreviews = [...previews.relatedImages];
      newPreviews[index] = e.target.result;
      setPreviews(prev => ({ ...prev, relatedImages: newPreviews }));
    };
    reader.readAsDataURL(file);
  };

  const addRelatedImageSlot = () => {
    setFiles(prev => ({
      ...prev,
      relatedImages: [...prev.relatedImages, null]
    }));
    setPreviews(prev => ({
      ...prev,
      relatedImages: [...prev.relatedImages, '']
    }));
    setFileUploading(prev => ({
      ...prev,
      related: [...prev.related, false]
    }));
  };

  const removeRelatedImage = (index) => {
    setFiles(prev => ({
      ...prev,
      relatedImages: prev.relatedImages.filter((_, i) => i !== index)
    }));
    setPreviews(prev => ({
      ...prev,
      relatedImages: prev.relatedImages.filter((_, i) => i !== index)
    }));
    setFormData(prev => ({
      ...prev,
      related_images: prev.related_images.filter((_, i) => i !== index)
    }));
  };

  const removeMainImage = () => {
    setFiles(prev => ({ ...prev, mainImage: null }));
    setPreviews(prev => ({ ...prev, mainImage: '' }));
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category.trim()) {
      toast({
        title: "Validation Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.author.trim()) {
      toast({
        title: "Validation Error",
        description: "Author is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.status === 'published' && !formData.published_at) {
      toast({
        title: "Validation Error",
        description: "Published date is required for published articles",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const uploadFiles = async (newsId) => {
    const uploadedUrls = {
      image_url: formData.image_url,
      related_images: [...formData.related_images]
    };

    try {
      // Upload main image
      if (files.mainImage) {
        setFileUploading(prev => ({ ...prev, main: true }));
        uploadedUrls.image_url = await uploadNewsMainImage(newsId, files.mainImage);
      }

      // Upload related images
      for (let i = 0; i < files.relatedImages.length; i++) {
        if (files.relatedImages[i]) {
          setFileUploading(prev => ({
            ...prev,
            related: prev.related.map((status, idx) => idx === i ? true : status)
          }));
          const url = await uploadNewsRelatedImage(newsId, files.relatedImages[i], i + 1);
          uploadedUrls.related_images[i] = url;
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    } finally {
      setFileUploading({
        main: false,
        related: files.relatedImages.map(() => false)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      let newsId = id;
      let uploadedUrls = {};

      const newsData = {
        ...formData,
        published_at: formData.status === 'published' ? formData.published_at : null,
      };

      if (isEdit) {
        // Update existing news
        await updateNews(id, newsData);
        
        // Upload new files if any
        uploadedUrls = await uploadFiles(id);
        
        // Update with new URLs
        if (Object.keys(uploadedUrls).length > 0) {
          await updateNews(id, uploadedUrls);
        }
      } else {
        // Create new news
        const newNews = await createNews(newsData);
        newsId = newNews.id;
        
        // Upload files
        uploadedUrls = await uploadFiles(newsId);
        
        // Update with file URLs
        if (Object.keys(uploadedUrls).length > 0) {
          await updateNews(newsId, uploadedUrls);
        }
      }

      toast({
        title: "Success",
        description: `News article ${isEdit ? 'updated' : 'created'} successfully`,
      });

      navigate('/admin/news');
    } catch (error) {
      console.error('Error saving news:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? 'update' : 'create'} news article`,
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
          onClick={() => navigate('/admin/news')}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit News Article' : 'Add New News Article'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update news article information' : 'Create a new news article'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter article title"
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
                    placeholder="article-slug"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Fashion, Culture, News"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      placeholder="Author name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of the article"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
                    placeholder="Write your article content here..."
                    height={400}
                  />
                  <p className="text-sm text-gray-500">
                    You can use rich text formatting. Preview is available.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Related Images */}
            <Card>
              <CardHeader>
                <CardTitle>Related Images</CardTitle>
                <p className="text-sm text-gray-600">Add multiple images to showcase in the article</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">                  
                  {previews.relatedImages.map((preview, index) => (
                    <div key={`related-image-${index}-${preview ? preview.slice(-10) : index}`} className="space-y-2">
                      <Label>Related Image {index + 1}</Label>
                      {preview && (
                        <div className="relative">
                          <img
                            src={preview}
                            alt={`Related ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => removeRelatedImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleRelatedImageChange(index)}
                          className="hidden"
                          id={`related-${index}`}
                          disabled={fileUploading.related[index]}
                        />
                        <Label
                          htmlFor={`related-${index}`}
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {fileUploading.related[index] ? 'Uploading...' : `Upload Related Image ${index + 1}`}
                          </span>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRelatedImageSlot}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Related Image
                </Button>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title for search engines"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="SEO description for search engines"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={formData.tags.join(', ')}
                    onChange={handleTagsChange}
                    placeholder="batik, fashion, traditional (comma-separated)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                {formData.status === 'published' && (
                  <div className="space-y-2">
                    <Label htmlFor="published_at">Published Date</Label>
                    <Input
                      id="published_at"
                      name="published_at"
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                {previews.mainImage && (
                  <div className="relative mb-4">
                    <img
                      src={previews.mainImage}
                      alt="Featured Image"
                      className="w-full h-48 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1"
                      onClick={removeMainImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                    id="main-image"
                    disabled={fileUploading.main}
                  />
                  <Label
                    htmlFor="main-image"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {fileUploading.main ? 'Uploading...' : 'Upload Featured Image'}
                    </span>
                  </Label>
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
            onClick={() => navigate('/admin/news')}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={saving || fileUploading.main || fileUploading.related.some(status => status)}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewsFormPage;
