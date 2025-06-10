import { supabase, supabaseAdmin } from './supabase';
import { storageService, STORAGE_BUCKETS } from './storageService';

export const productService = {
  // Get all products with category relations
  async getAllProducts(filters = {}) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(id, name, slug),
        product_images(id, url, caption)
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

  // Get product by ID
  async getProductById(id) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!products_category_id_fkey(id, name, slug),
        product_images(id, url, caption)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  // Create product with proper image handling
  async createProduct(productData, imageFile = null, productImages = [], stampingTools = []) {
    try {
      let imageUrl = productData.image_url;

      // Remove product_images from productData as it's a separate table
      const { product_images, ...cleanProductData } = productData;

      // First create the product to get the ID
      const { data: newProduct, error: createError } = await supabaseAdmin
        .from('products')
        .insert([{
          ...cleanProductData,
          image_url: null // Will be updated after image upload
        }])
        .select()
        .single();

      if (createError) throw createError;

      // Handle main image upload if provided
      if (imageFile) {
        imageUrl = await this.uploadProductImage(imageFile, newProduct.id, 'main');
      }

      // Handle product images upload
      const uploadedProductImages = [];
      if (productImages && productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          const img = productImages[i];
          if (img.file) {
            const uploadedUrl = await this.uploadProductImage(img.file, newProduct.id, `detail-${i + 1}`);
            await this.addProductImage(newProduct.id, uploadedUrl, img.caption);
            uploadedProductImages.push({ url: uploadedUrl, caption: img.caption });
          } else if (img.url) {
            await this.addProductImage(newProduct.id, img.url, img.caption);
            uploadedProductImages.push({ url: img.url, caption: img.caption });
          }        }
      }

      // Process stamping tools with image uploads
      let processedStampingTools = [];
      if (stampingTools && stampingTools.length > 0) {
        processedStampingTools = await this.processStampingTools(stampingTools, newProduct.id);
      }

      // Update product with main image URL and processed stamping tools
      const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from('products')
        .update({ 
          image_url: imageUrl,
          stamping_tools: processedStampingTools
        })
        .eq('id', newProduct.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  // Update product with proper image handling
  async updateProduct(id, productData, imageFile = null, productImages = [], stampingTools = []) {
    try {
      let imageUrl = productData.image_url;

      // Handle main image upload if provided
      if (imageFile) {
        // Get current product to check for existing image
        const currentProduct = await this.getProductById(id);
        
        // Delete old main image if it exists
        if (currentProduct.image_url) {
          await this.deleteProductImage(id, 'main');
        }

        // Upload new main image
        imageUrl = await this.uploadProductImage(imageFile, id, 'main');
      }

      // Handle product images - first delete existing ones
      const currentProduct = await this.getProductById(id);
      if (currentProduct.product_images && currentProduct.product_images.length > 0) {
        for (const img of currentProduct.product_images) {
          await this.deleteProductImageRecord(img.id);
        }
      }

      // Upload new product images
      if (productImages && productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          const img = productImages[i];
          if (img.file) {
            const uploadedUrl = await this.uploadProductImage(img.file, id, `detail-${i + 1}`);
            await this.addProductImage(id, uploadedUrl, img.caption);
          } else if (img.url) {
            await this.addProductImage(id, img.url, img.caption);
          }        }
      }

      // Process stamping tools with image uploads
      let processedStampingTools = productData.stamping_tools || [];
      if (stampingTools && stampingTools.length > 0) {
        processedStampingTools = await this.processStampingTools(stampingTools, id);
      }

      // Remove product_images from productData as it's a separate table
      const { product_images, ...cleanProductData } = productData;

      // Update product
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({
          ...cleanProductData,
          image_url: imageUrl,
          stamping_tools: processedStampingTools
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Simple update for basic field changes (like featured status)
  async updateProductFields(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product fields:', error);
      throw error;
    }
  },

  // Delete product and its images
  async deleteProduct(id) {
    try {
      // Get product to check for images
      const product = await this.getProductById(id);
      
      // Delete all product images and folder
      if (product.image_url || (product.product_images && product.product_images.length > 0)) {
        await this.deleteProductFolder(id);
      }

      // Delete product (this will cascade delete product_images due to foreign key)
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Upload product image with organized folder structure
  async uploadProductImage(file, productId, imageType = 'main') {
    try {
      // Create organized folder structure: products/{productId}/{imageType}.{extension}
      const fileExtension = file.name.split('.').pop();
      const fileName = `${imageType}.${fileExtension}`;
      const folderPath = `products/${productId}/${fileName}`;
      
      // Upload to products bucket
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.PRODUCTS, 
        file, 
        folderPath
      );
      
      console.log('Product image uploaded:', uploadResult.publicUrl);
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  },

  // Delete product image
  async deleteProductImage(productId, imageType = 'main') {
    try {
      // Try to delete common image extensions
      const extensions = ['jpg', 'jpeg', 'png', 'webp'];
      for (const ext of extensions) {
        try {
          const filePath = `products/${productId}/${imageType}.${ext}`;
          await storageService.deleteFile(STORAGE_BUCKETS.PRODUCTS, filePath);
        } catch (error) {
          // Continue if file doesn't exist
        }
      }
    } catch (error) {
      console.error('Error deleting product image:', error);
      // Don't throw error here as it might be already deleted
    }
  },

  // Delete product folder and all its contents
  async deleteProductFolder(productId) {
    try {
      const folderPath = `products/${productId}`;
      
      // List all files in the product folder
      const files = await storageService.listFiles(STORAGE_BUCKETS.PRODUCTS, folderPath);
      
      // Delete all files in the folder
      if (files && files.length > 0) {
        for (const file of files) {
          await storageService.deleteFile(STORAGE_BUCKETS.PRODUCTS, file.fullPath);
        }
      }
      
      console.log(`Deleted product folder: ${folderPath}`);
    } catch (error) {
      console.error('Error deleting product folder:', error);
      throw error;
    }
  },

  // Add product image record
  async addProductImage(productId, url, caption = '') {
    try {
      const { data, error } = await supabaseAdmin
        .from('product_images')
        .insert([{
          product_id: productId,
          url: url,
          caption: caption
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding product image:', error);
      throw error;
    }
  },

  // Delete product image record
  async deleteProductImageRecord(imageId) {
    try {
      const { error } = await supabaseAdmin
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product image record:', error);
      throw error;
    }
  },

  // Get all categories for dropdown
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (error) throw error;
    return data;
  },
  // Get all filters
  async getAllFilters() {
    try {
      const [colorsRes, capRes, tiedyeRes] = await Promise.all([
        supabase.from('colors').select('*').order('name'),
        supabase.from('cap_patterns').select('*').order('name'),
        supabase.from('tiedye_patterns').select('*').order('name')
      ]);

      return {
        colors: colorsRes.data || [],
        cap_patterns: capRes.data || [],
        tiedye_patterns: tiedyeRes.data || []
      };
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }  },

  // Simple update for individual fields (like featured toggle)
  async updateProductFields(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product fields:', error);
      throw error;
    }
  },
  // Upload stamping tool image
  async uploadStampingToolImage(imageFile, productId, toolIndex) {
    try {
      const fileName = `cap-${toolIndex}-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const filePath = `cap/${fileName}`;
      
      const uploadResult = await storageService.uploadFile(STORAGE_BUCKETS.IMAGES, imageFile, filePath);
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading stamping tool image:', error);
      throw error;
    }
  },
  // Process stamping tools with image uploads
  async processStampingTools(stampingTools, productId) {
    try {
      console.log('Processing stamping tools:', stampingTools);
      const processedTools = [];
      
      for (let i = 0; i < stampingTools.length; i++) {
        const tool = stampingTools[i];
        console.log(`Processing tool ${i}:`, tool);
        
        let toolData = {
          name: tool.name,
          url: tool.url || '',
          description: tool.description || '',
          usageArea: tool.usageArea || ''
        };

        // If there's an image file, upload it
        if (tool.imageFile) {
          try {
            console.log('Uploading image for tool:', tool.name);
            const imageUrl = await this.uploadStampingToolImage(tool.imageFile, productId, i);
            toolData.imageUrl = imageUrl;
            console.log('Image uploaded successfully:', imageUrl);
          } catch (error) {
            console.error('Error uploading stamping tool image:', error);
            // Continue without image if upload fails
          }
        } else if (tool.imageUrl) {
          // Keep existing image URL
          toolData.imageUrl = tool.imageUrl;
        }

        processedTools.push(toolData);
      }

      console.log('Processed tools:', processedTools);
      return processedTools;
    } catch (error) {
      console.error('Error processing stamping tools:', error);
      throw error;
    }
  }
};
