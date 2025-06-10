import { supabase, supabaseAdmin } from './supabase';
import { storageService, STORAGE_BUCKETS } from './storageService';

export const categoryService = {
  // Get all categories
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

  // Get category by ID
  async getCategoryById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create category with proper image handling
  async createCategory(categoryData, imageFile = null) {
    try {
      let imageUrl = categoryData.image_url;

      // Handle image upload if provided
      if (imageFile) {
        // First create the category to get the ID
        const { data: newCategory, error: createError } = await supabaseAdmin
          .from('categories')
          .insert([{
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
            image_url: null // Will be updated after image upload
          }])
          .select()
          .single();

        if (createError) throw createError;

        // Upload image with category ID in path
        imageUrl = await this.uploadCategoryImage(imageFile, newCategory.id);

        // Update category with image URL
        const { data: updatedCategory, error: updateError } = await supabaseAdmin
          .from('categories')
          .update({ image_url: imageUrl })
          .eq('id', newCategory.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedCategory;
      } else {
        // Create category without image
        const { data, error } = await supabaseAdmin
          .from('categories')
          .insert([categoryData])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update category with proper image handling
  async updateCategory(id, categoryData, imageFile = null) {
    try {
      let imageUrl = categoryData.image_url;

      // Handle image upload if provided
      if (imageFile) {
        // Get current category to check for existing image
        const currentCategory = await this.getCategoryById(id);
        
        // Delete old image if it exists
        if (currentCategory.image_url) {
          await this.deleteCategoryImage(id);
        }

        // Upload new image
        imageUrl = await this.uploadCategoryImage(imageFile, id);
      }

      // Update category
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update({
          ...categoryData,
          image_url: imageUrl
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category and its image
  async deleteCategory(id) {
    try {
      // Get category to check for image
      const category = await this.getCategoryById(id);
      
      // Delete image if exists
      if (category.image_url) {
        await this.deleteCategoryImage(id);
      }

      // Delete category
      const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Upload category image with organized folder structure
  async uploadCategoryImage(file, categoryId) {
    try {
      // Create organized folder structure: images/category/{categoryId}/category{categoryId}.jpg
      const fileExtension = file.name.split('.').pop();
      const fileName = `category${categoryId}.${fileExtension}`;
      const folderPath = `category/${categoryId}/${fileName}`;
      
      // Upload to images bucket
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.IMAGES, 
        file, 
        folderPath
      );
      
      console.log('Category image uploaded:', uploadResult.publicUrl);
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading category image:', error);
      throw error;
    }
  },

  // Delete category image and folder
  async deleteCategoryImage(categoryId) {
    try {
      // Delete the entire category folder
      await this.deleteCategoryFolder(categoryId);
    } catch (error) {
      console.error('Error deleting category image:', error);
      // Don't throw error here as it might be already deleted
    }
  },

  // Delete category folder and all its contents
  async deleteCategoryFolder(categoryId) {
    try {
      const folderPath = `category/${categoryId}`;
      
      // List all files in the category folder
      const files = await storageService.listFiles(STORAGE_BUCKETS.IMAGES, folderPath);
      
      // Delete all files in the folder
      if (files && files.length > 0) {
        const filePaths = files.map(file => file.fullPath);
        for (const filePath of filePaths) {
          await storageService.deleteFile(STORAGE_BUCKETS.IMAGES, filePath);
        }
      }
      
      console.log(`Deleted category folder: ${folderPath}`);
    } catch (error) {
      console.error('Error deleting category folder:', error);
      throw error;
    }
  }
};
