import { supabase } from './supabase.js';

// Storage bucket names
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  DOCUMENTS: 'documents',
  PRODUCTS: 'products',
  COMPANY: 'company'
};

// Storage service for handling file uploads and management
export class SupabaseStorageService {
  constructor() {
    this.storage = supabase.storage;
  }

  // Check if buckets are available (instead of creating them)
  async checkBucketsAvailability() {
    try {
      const { data: buckets, error } = await this.storage.listBuckets();
      
      if (error) {
        console.error('Error checking buckets:', error);
        return false;
      }

      const requiredBuckets = Object.values(STORAGE_BUCKETS);
      const availableBuckets = buckets.map(bucket => bucket.name);
      
      const missingBuckets = requiredBuckets.filter(bucket => 
        !availableBuckets.includes(bucket)
      );      if (missingBuckets.length > 0) {
        console.warn('Missing storage buckets:', missingBuckets);
        console.warn('Please create these buckets in Supabase Dashboard or run storage-policies.sql');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking bucket availability:', error);
      return false;
    }
  }
  // Get allowed MIME types for each bucket
  getAllowedMimeTypes(bucketName) {
    switch (bucketName) {
      case STORAGE_BUCKETS.IMAGES:
      case STORAGE_BUCKETS.PRODUCTS:
      case STORAGE_BUCKETS.COMPANY:
        return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      case STORAGE_BUCKETS.DOCUMENTS:
        return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      default:
        return null;
    }
  }  // Get file size limit for each bucket (in bytes)
  getFileSizeLimit(bucketName) {
    switch (bucketName) {
      case STORAGE_BUCKETS.IMAGES:
      case STORAGE_BUCKETS.PRODUCTS:
      case STORAGE_BUCKETS.COMPANY:
        return 10 * 1024 * 1024; // 10MB
      default:
        return 10 * 1024 * 1024; // 10MB (updated from 5MB)
    }
  }
  // Upload file to specific bucket with enhanced error handling
  async uploadFile(bucketName, file, path = null) {
    try {
      // First check if bucket exists
      const bucketAvailable = await this.checkBucketsAvailability();
      if (!bucketAvailable) {
        throw new Error('Storage buckets not configured. Please set up buckets in Supabase Dashboard.');
      }

      // Generate unique filename if path not provided
      const fileName = path || `${Date.now()}-${file.name}`;
      
      // Upload file
      const { data, error } = await this.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // Provide more specific error messages
        if (error.message.includes('new row violates row-level security policy')) {
          throw new Error('Storage bucket permissions not configured properly. Please check bucket policies.');
        } else if (error.message.includes('exceeded the maximum allowed size')) {
          throw new Error(`File too large. Maximum allowed size for ${bucketName} bucket is ${this.getFileSizeLimit(bucketName) / (1024 * 1024)}MB.`);
        } else if (error.message.includes('Bucket not found')) {
          throw new Error(`Bucket '${bucketName}' does not exist. Please create it in Supabase Dashboard.`);
        }
        throw error;
      }

      // Get public URL
      const { data: urlData } = this.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: urlData.publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        bucketName
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(bucketName, files) {
    const uploadPromises = files.map(file => this.uploadFile(bucketName, file));
    return Promise.all(uploadPromises);
  }

  // Delete file from bucket
  async deleteFile(bucketName, filePath) {
    try {
      const { error } = await this.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
  // Get public URL for a file
  getPublicUrl(bucketName, filePath) {
    try {
      // Clean up the file path to avoid double slashes
      const cleanFilePath = filePath.replace(/\/+/g, '/').replace(/^\//, '');
      
      const { data } = this.storage
        .from(bucketName)
        .getPublicUrl(cleanFilePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  }
  // List files in bucket
  async listFiles(bucketName, folder = '', limit = 100) {
    try {
      const { data, error } = await this.storage
        .from(bucketName)
        .list(folder, {
          limit,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw error;
      }

      return data.map(file => {
        // Fix path construction to avoid double slashes
        const filePath = folder ? `${folder}/${file.name}` : file.name;
        
        return {
          ...file,
          publicUrl: this.getPublicUrl(bucketName, filePath),
          bucketName,
          fullPath: filePath
        };
      });
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Search files by name
  async searchFiles(bucketName, searchTerm) {
    try {
      const files = await this.listFiles(bucketName);
      return files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  }

  // Get file info
  async getFileInfo(bucketName, filePath) {
    try {
      const { data, error } = await this.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (error) {
        throw error;
      }

      return {
        path: filePath,
        publicUrl: data.publicUrl,
        bucketName
      };
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  // Download file
  async downloadFile(bucketName, filePath) {
    try {
      const { data, error } = await this.storage
        .from(bucketName)
        .download(filePath);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  // Copy file within or between buckets
  async copyFile(fromBucket, fromPath, toBucket, toPath) {
    try {
      const { data, error } = await this.storage
        .from(fromBucket)
        .copy(fromPath, toPath, {
          destinationBucket: toBucket
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error;
    }
  }

  // Move file within or between buckets
  async moveFile(fromBucket, fromPath, toBucket, toPath) {
    try {
      const { data, error } = await this.storage
        .from(fromBucket)
        .move(fromPath, toPath, {
          destinationBucket: toBucket
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error moving file:', error);
      throw error;
    }
  }

  // Create folder structure
  async createFolder(bucketName, folderPath) {
    try {
      // Create a placeholder file to create the folder structure
      const placeholderContent = new Blob([''], { type: 'text/plain' });
      const placeholderFile = new File([placeholderContent], '.placeholder', { type: 'text/plain' });
      
      await this.uploadFile(bucketName, placeholderFile, `${folderPath}/.placeholder`);
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }
  // Debug function to troubleshoot bucket access
  async debugBucketAccess() {
    try {
      // Test 1: Check if we can connect to Supabase
      const { data: buckets, error } = await this.storage.listBuckets();
      
      if (error) {
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          statusCode: error.statusCode,
          details: error.details
        });
        
        // Check if it's an authentication issue
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          console.warn('🔑 This looks like an authentication issue. Check your SUPABASE_ANON_KEY');
        }
        
        // Check if it's an RLS issue
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          console.warn('🔒 This looks like a Row Level Security policy issue');
        }
        
        return false;
      }
      
      if (buckets && Array.isArray(buckets)) {
        // Check which required buckets are missing
        const requiredBuckets = Object.values(STORAGE_BUCKETS);
        const availableBuckets = buckets.map(bucket => bucket.name);
        const missingBuckets = requiredBuckets.filter(bucket => 
          !availableBuckets.includes(bucket)
        );
        
        if (missingBuckets.length > 0) {
          console.warn('❌ Missing buckets:', missingBuckets);
        }
        
        return missingBuckets.length === 0;
      }
      
      return false;
      
    } catch (error) {
      console.error('💥 Unexpected error during bucket access:', error);
      return false;
    }
  }
}

// Create singleton instance
export const storageService = new SupabaseStorageService();

// Helper functions for common operations
export const uploadCompanyImage = (file, category = 'general') => {
  return storageService.uploadFile(STORAGE_BUCKETS.COMPANY, file, `${category}/${Date.now()}-${file.name}`);
};

export const uploadProductImage = (file, productId = null) => {
  const folder = productId ? `products/${productId}` : 'products/general';
  return storageService.uploadFile(STORAGE_BUCKETS.PRODUCTS, file, `${folder}/${Date.now()}-${file.name}`);
};

// Storage service is ready to use
// Note: Buckets must be created manually in Supabase Dashboard
