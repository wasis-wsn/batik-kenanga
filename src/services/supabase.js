import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Regular client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for admin operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

// Database helper functions
const supabaseHelpers = {
  // Categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('name');
    
    if (error) throw error;
    return data.map(category => ({
      ...category,
      product_count: category.products?.[0]?.count || 0
    }));
  },

  async getCategoryById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCategory(id, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Products
  async getAllProducts(filters = {}) {
    let query = supabase
      .from('products')      .select(`
        *,
        categories!products_category_id_fkey(name, slug),
        product_images(url, caption)
      `);

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.featured !== undefined) {
      query = query.eq('featured', filters.featured);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(name, slug),
        product_images(url, caption)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  async getProductBySlug(slug) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(name, slug),
        product_images(url, caption)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  async getProductsByCategory(categoryId) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(name, slug),
        product_images(url, caption)
      `)
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  async searchProducts(query) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(name, slug),
        product_images(url, caption)
      `)
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // News
  async getAllNews(filters = {}) {
    let query = supabase
      .from('news')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getNewsById(id) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getNewsBySlug(slug) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createNews(news) {
    const { data, error } = await supabase
      .from('news')
      .insert([news])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateNews(id, updates) {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteNews(id) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Testimonials
  async getAllTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTestimonialById(id) {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createTestimonial(testimonial) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateTestimonial(id, updates) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteTestimonial(id) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getFeaturedTestimonials() {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  // Testimonial file uploads
  async uploadTestimonialMainImage(testimonialId, file) {
    const filePath = `testimonial/${testimonialId}/main.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },

  async uploadTestimonialGalleryImage(testimonialId, file, imageNumber) {
    const filePath = `testimonial/${testimonialId}/gambar${imageNumber}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },

  async uploadTestimonialLogo(testimonialId, file) {
    const filePath = `testimonial/${testimonialId}/logo.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },

  async uploadTestimonialPrintingMethod(testimonialId, file) {
    const filePath = `testimonial/${testimonialId}/printing/teknikbatik.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },
  async deleteTestimonialFiles(testimonialId) {
    // Delete all files related to a testimonial
    const filePaths = [
      `testimonial/${testimonialId}/main.jpg`,
      `testimonial/${testimonialId}/logo.jpg`,
      `testimonial/${testimonialId}/printing/teknikbatik.jpg`,
      `testimonial/${testimonialId}/gambar1.jpg`,
      `testimonial/${testimonialId}/gambar2.jpg`,
      `testimonial/${testimonialId}/gambar3.jpg`
    ];

    // Delete files (ignore errors for non-existent files)
    for (const filePath of filePaths) {
      await supabase.storage
        .from('documents')
        .remove([filePath]);
    }
  },

  // News file uploads
  async uploadNewsMainImage(newsId, file) {
    const filePath = `news/${newsId}/main.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },

  async uploadNewsRelatedImage(newsId, file, imageNumber) {
    const filePath = `news/${newsId}/gambar${imageNumber}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, { 
        upsert: true,
        contentType: file.type
      });
    
    if (uploadError) throw uploadError;
    
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  },

  async deleteNewsFiles(newsId) {
    // Delete main image
    const mainImagePath = `news/${newsId}/main.jpg`;
    await supabase.storage
      .from('documents')
      .remove([mainImagePath]);

    // Delete related images (up to 10 images)
    const relatedImagePaths = [];
    for (let i = 1; i <= 10; i++) {
      relatedImagePaths.push(`news/${newsId}/gambar${i}.jpg`);
    }

    // Delete files (ignore errors for non-existent files)
    for (const filePath of relatedImagePaths) {
      await supabase.storage
        .from('documents')
        .remove([filePath]);
    }
  },

  // Company Info
  async getCompanyInfo() {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateCompanyInfo(updates) {
    // First try to update existing record
    const { data: existingData } = await supabase
      .from('company_info')
      .select('id')
      .limit(1)
      .single();

    if (existingData) {
      const { data, error } = await supabase
        .from('company_info')
        .update(updates)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new record if none exists
      const { data, error } = await supabase
        .from('company_info')
        .insert([updates])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Media Library
  async getAllMediaFiles() {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async addToMediaLibrary(fileData) {
    const { data, error } = await supabase
      .from('media_library')
      .insert([fileData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteFromMediaLibrary(id) {
    const { error } = await supabase
      .from('media_library')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
  // File Storage
  async uploadFile(file, path) {
    const { error } = await supabase.storage
      .from('images')
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    
    // Add to media library
    const fileData = {
      name: file.name,
      file_path: path,
      url: urlData.publicUrl,
      file_type: file.type,
      file_size: file.size
    };
    
    await this.addToMediaLibrary(fileData);
    
    return urlData.publicUrl;
  },

  async deleteFile(path) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([path]);
    
    if (storageError) throw storageError;
    
    // Delete from media library
    const { error: dbError } = await supabase
      .from('media_library')
      .delete()
      .eq('file_path', path);
    
    if (dbError) throw dbError;
  },

  // Settings
  async getSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('key');
    
    if (error) throw error;
    return data;
  },

  async updateSetting(key, value) {
    const { data, error } = await supabase
      .from('settings')
      .upsert([{ key, value }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};// Export individual functions for easier use
export const {
  // Categories
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,

  // Products
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  searchProducts,
  // News
  getAllNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsMainImage,
  uploadNewsRelatedImage,
  deleteNewsFiles,// Testimonials
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,  updateTestimonial,
  deleteTestimonial,
  getFeaturedTestimonials,
  uploadTestimonialMainImage,
  uploadTestimonialGalleryImage,
  uploadTestimonialLogo,
  uploadTestimonialPrintingMethod,
  deleteTestimonialFiles,

  // Company Info
  getCompanyInfo,
  updateCompanyInfo,

  // Media Library
  getAllMediaFiles,
  addToMediaLibrary,
  deleteFromMediaLibrary,
  uploadFile,
  deleteFile,

  // Settings
  getSettings,
  updateSetting
} = supabaseHelpers;

export default supabase;
