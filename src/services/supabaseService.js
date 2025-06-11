import { supabase, supabaseAdmin } from './supabase';
import { storageService, STORAGE_BUCKETS } from './storageService';

// Company Info Service
export const companyInfoService = {  async getCompanyInfo() {
    try {
      const { data, error } = await supabaseAdmin
        .from('company_info')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  },  async updateCompanyInfo(updates) {
    try {
      // Since we know there's only one company_info record, update it directly
      const { data, error } = await supabaseAdmin
        .from('company_info')
        .update(updates)
        .neq('id', '00000000-0000-0000-0000-000000000000') // This will match all records
        .select();
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
        if (data && data.length > 0) {
        return data[0];
      } else {
        // If no existing record, create one
        const { data: insertData, error: insertError } = await supabaseAdmin
          .from('company_info')
          .insert([updates])
          .select();
        
        if (insertError) throw insertError;
        return insertData && insertData.length > 0 ? insertData[0] : null;
      }
    } catch (error) {
      console.error('Error updating company info:', error);
      throw error;
    }
  },
  async createCompanyInfo(companyData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('company_info')
        .insert([companyData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating company info:', error);
      throw error;
    }  },

  // Upload company logo (replaces existing logo)
  async uploadLogo(file) {
    try {
      // First, get current logo URL to delete old file
      const { data: currentData } = await supabaseAdmin
        .from('company_info')
        .select('logo_url_light')
        .limit(1);
      
      // Delete old logo if it exists and is stored in our bucket
      if (currentData && currentData.length > 0 && currentData[0].logo_url_light) {
        const oldUrl = currentData[0].logo_url_light;
        if (oldUrl.includes('/storage/v1/object/public/company/logos/')) {
          // Extract file path from URL
          const urlParts = oldUrl.split('/storage/v1/object/public/company/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            try {
              await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, filePath);
            } catch (deleteError) {
              console.warn('Could not delete old logo:', deleteError);
              // Continue with upload even if delete fails
            }
          }
        }
      }
      
      // Upload new logo
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file, 
        `logos/${Date.now()}-${file.name}`
      );
      
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }  },

  // Upload hero image (replaces existing hero image)
  async uploadHeroImage(file) {
    try {
      // First, get current hero image URL to delete old file
      const { data: currentData } = await supabaseAdmin
        .from('company_info')
        .select('hero_image')
        .limit(1);
      
      // Delete old hero image if it exists and is stored in our bucket
      if (currentData && currentData.length > 0 && currentData[0].hero_image) {
        const oldUrl = currentData[0].hero_image;
        if (oldUrl.includes('/storage/v1/object/public/company/hero-images/')) {
          // Extract file path from URL
          const urlParts = oldUrl.split('/storage/v1/object/public/company/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            try {
              await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, filePath);

            } catch (deleteError) {
              console.warn('Could not delete old hero image:', deleteError);
              // Continue with upload even if delete fails
            }
          }
        }
      }
      
      // Upload new hero image
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file, 
        `hero-images/${Date.now()}-${file.name}`
      );
      

      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading hero image:', error);
      throw error;
    }  },

  // Upload home page image (replaces existing home page image)
  async uploadHomePageImage(file) {
    try {
      // First, get current home page image URL to delete old file
      const { data: currentData } = await supabaseAdmin
        .from('company_info')
        .select('home_page_image')
        .limit(1);
      
      // Delete old home page image if it exists and is stored in our bucket
      if (currentData && currentData.length > 0 && currentData[0].home_page_image) {
        const oldUrl = currentData[0].home_page_image;
        if (oldUrl.includes('/storage/v1/object/public/company/home-page-images/')) {
          // Extract file path from URL
          const urlParts = oldUrl.split('/storage/v1/object/public/company/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            try {
              await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, filePath);

            } catch (deleteError) {
              console.warn('Could not delete old home page image:', deleteError);
              // Continue with upload even if delete fails
            }
          }
        }
      }
      
      // Upload new home page image
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file,        `home-page-images/${Date.now()}-${file.name}`
      );
      
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading home page image:', error);
      throw error;
    }  },

  // Upload profile image (replaces existing profile image)
  async uploadProfileImage(file) {
    try {
      // First, get current profile image URL to delete old file
      const { data: currentData } = await supabaseAdmin
        .from('company_info')
        .select('profile_image')
        .limit(1);
      
      // Delete old profile image if it exists and is stored in our bucket
      if (currentData && currentData.length > 0 && currentData[0].profile_image) {
        const oldUrl = currentData[0].profile_image;
        if (oldUrl.includes('/storage/v1/object/public/company/profile-images/')) {
          // Extract file path from URL
          const urlParts = oldUrl.split('/storage/v1/object/public/company/');
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            try {
              await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, filePath);

            } catch (deleteError) {
              console.warn('Could not delete old profile image:', deleteError);
              // Continue with upload even if delete fails
            }
          }
        }
      }
      
      // Upload new profile image
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file,        `profile-images/${Date.now()}-${file.name}`
      );
      
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }  },

  // Note: Hero videos are now served statically from public/videos/
  // Upload team member image with organized folder structure
  async uploadTeamMemberImage(file, memberIndex, existingImageUrl = null) {
    try {
      // Delete existing image if exists
      if (existingImageUrl?.includes('/storage/v1/object/public/company/team/')) {
        const urlParts = existingImageUrl.split('/storage/v1/object/public/company/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          try {
            await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, filePath);

          } catch (deleteError) {
            console.warn('Could not delete old team member image:', deleteError);
            // Continue with upload even if delete fails
          }
        }
      }
      
      // Create organized folder structure: team/{memberIndex}/foto.jpg
      const fileExtension = file.name.split('.').pop();
      const fileName = `foto.${fileExtension}`;
      const folderPath = `team/${memberIndex}/${fileName}`;
      
      // Upload new team member image
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file, 
        folderPath
      );
      

      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading team member image:', error);
      throw error;
    }
  },

  // Delete team member folder and all its contents
  async deleteTeamMemberImages(memberIndex) {
    try {      // List all files in the member's folder
      const files = await storageService.listFiles(STORAGE_BUCKETS.COMPANY, `team/${memberIndex}`);
      
      // Delete all files in the folder
      for (const file of files) {
        await storageService.deleteFile(STORAGE_BUCKETS.COMPANY, file.fullPath);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting team member images:', error);
      throw error;
    }  },

  // Upload company images
  async uploadCompanyImage(file, category = 'general') {
    try {
      const uploadResult = await storageService.uploadFile(
        STORAGE_BUCKETS.COMPANY, 
        file, 
        `${category}/${Date.now()}-${file.name}`
      );
      
      return uploadResult.publicUrl;
    } catch (error) {
      console.error('Error uploading company image:', error);
      throw error;
    }
  }
};

// Media Library Service
export const mediaLibraryService = {
  async getAllMediaFiles() {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching media files:', error);
      throw error;
    }
  },

  async addToMediaLibrary(fileData) {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .insert([fileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to media library:', error);
      throw error;
    }
  },

  async deleteFromMediaLibrary(id) {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting from media library:', error);
      throw error;
    }
  },

  async uploadAndAddToLibrary(file, category = 'general') {    try {
      // Upload file to storage (videos are not supported - use static files)
      const bucket = STORAGE_BUCKETS.IMAGES;
      
      const uploadResult = await storageService.uploadFile(
        bucket, 
        file, 
        `${category}/${Date.now()}-${file.name}`
      );
      
      // Add to media library database
      const fileData = {
        name: file.name,
        file_path: uploadResult.path,
        url: uploadResult.publicUrl,
        file_type: file.type,
        file_size: file.size,
        bucket_name: bucket,
        category: category
      };
      
      const libraryEntry = await this.addToMediaLibrary(fileData);
      
      return {
        ...libraryEntry,
        uploadResult
      };
    } catch (error) {
      console.error('Error uploading and adding to library:', error);
      throw error;
    }
  },

  async deleteFileAndFromLibrary(mediaId, filePath, bucketName) {
    try {
      // Delete from storage
      await storageService.deleteFile(bucketName, filePath);
      
      // Delete from media library
      await this.deleteFromMediaLibrary(mediaId);
    } catch (error) {
      console.error('Error deleting file and from library:', error);
      throw error;
    }
  }
};

// Settings Service
export const settingsService = {
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  async getSetting(key) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data?.value || null;
    } catch (error) {
      console.error('Error fetching setting:', error);
      throw error;
    }
  },

  async updateSetting(key, value) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .upsert([{ key, value }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },  async updateMultipleSettings(settings) {
    try {

      
      // Process each setting individually to avoid conflicts
      const results = [];
      
      for (const [key, value] of Object.entries(settings)) {
        try {
          const processedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
          
          // First try to update existing record
          const { data: updateData, error: updateError } = await supabase
            .from('settings')
            .update({ value: processedValue })
            .eq('key', key)
            .select();
          
          if (updateError) {
            console.error(`Update error for key ${key}:`, updateError);
            throw updateError;
          }
          
          // If no rows were updated, insert new record
          if (!updateData || updateData.length === 0) {
            const { data: insertData, error: insertError } = await supabase
              .from('settings')
              .insert([{ key, value: processedValue }])
              .select();
            
            if (insertError) {
              console.error(`Insert error for key ${key}:`, insertError);
              throw insertError;
            }
            
            results.push(...(insertData || []));
          } else {
            results.push(...updateData);
          }
        } catch (err) {
          console.error(`Error processing setting ${key}:`, err);
          throw err;
        }
      }
      

      return results;
    } catch (error) {
      console.error('Error updating multiple settings:', error);
      throw error;
    }
  }
};

// Homepage Content Service
export const homepageService = {
  async getHomepageContent() {
    try {
      const companyInfo = await companyInfoService.getCompanyInfo();
      const heroSettings = await settingsService.getSetting('hero_section');
      const featuredProducts = await settingsService.getSetting('featured_products');
      
      return {
        companyInfo,
        heroSettings: heroSettings ? JSON.parse(heroSettings) : null,
        featuredProducts: featuredProducts ? JSON.parse(featuredProducts) : null
      };
    } catch (error) {
      console.error('Error fetching homepage content:', error);
      throw error;
    }
  },

  async updateHeroSection(heroData) {
    try {
      return await settingsService.updateSetting('hero_section', JSON.stringify(heroData));
    } catch (error) {
      console.error('Error updating hero section:', error);
      throw error;
    }
  },

  async updateFeaturedProducts(productIds) {
    try {
      return await settingsService.updateSetting('featured_products', JSON.stringify(productIds));
    } catch (error) {
      console.error('Error updating featured products:', error);
      throw error;
    }
  }
};

// Export all services
export {
  storageService,
  STORAGE_BUCKETS
};
