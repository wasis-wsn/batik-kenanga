import { supabase, supabaseAdmin } from './supabase';
import { storageService, STORAGE_BUCKETS } from './storageService';

// Media Library Service - Integrasi database dan storage
export class MediaLibraryService {
  constructor() {
    this.defaultBucket = STORAGE_BUCKETS.IMAGES;
  }

  // Get all media files from database
  async getAllMediaFiles() {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching media files from database:', error);
      throw error;
    }
  }
  // Sync storage files with database
  async syncStorageWithDatabase() {
    try {
      // Get all files from storage buckets
      const storageFiles = await this.getAllStorageFiles();
      
      // Get all files from database
      const dbFiles = await this.getAllMediaFiles();
      
      // Find files in storage but not in database
      const storageFilePaths = storageFiles.map(f => f.file_path);
      const dbFilePaths = dbFiles.map(f => f.file_path);
        const missingInDb = storageFiles.filter(f => !dbFilePaths.includes(f.file_path));
      
      // Add missing files to database
      for (const file of missingInDb) {
        try {
          await this.addFileToDatabase(file);
        } catch (error) {
          console.error(`Error adding file ${file.filename} to database:`, error);
        }
      }
      
      // Find files in database but not in storage (optional cleanup)
      const missingInStorage = dbFiles.filter(f => !storageFilePaths.includes(f.file_path));
      
      return {
        storageFiles: storageFiles.length,
        dbFiles: dbFiles.length,
        addedToDb: missingInDb.length,
        missingInStorage: missingInStorage.length
      };
    } catch (error) {
      console.error('Error syncing storage with database:', error);
      throw error;
    }
  }

  // Get all files from all storage buckets
  async getAllStorageFiles() {
    const allFiles = [];
    const buckets = [STORAGE_BUCKETS.IMAGES, STORAGE_BUCKETS.DOCUMENTS, STORAGE_BUCKETS.PRODUCTS, STORAGE_BUCKETS.COMPANY];
    
    for (const bucket of buckets) {
      try {
        let files = [];
        
        if (bucket === STORAGE_BUCKETS.COMPANY) {
          // For company bucket, get files from specific subfolders
          try {
            const logoFiles = await storageService.listFiles(bucket, 'logos');
            const heroFiles = await storageService.listFiles(bucket, 'hero-images');
            const homePageFiles = await storageService.listFiles(bucket, 'home-page-images');
            const profileFiles = await storageService.listFiles(bucket, 'profile-images');
            const teamFiles = await storageService.listFiles(bucket, 'team-members');
            files = [...logoFiles, ...heroFiles, ...homePageFiles, ...profileFiles, ...teamFiles];
          } catch (error) {
            console.warn(`Error fetching company subfolders:`, error);
            files = await storageService.listFiles(bucket);
          }
        } else {
          files = await storageService.listFiles(bucket);
        }
        
        const validFiles = files
          .filter(file => {
            // Filter out placeholder files and folders
            return !file.name.includes('.emptyFolderPlaceholder') && 
                   file.metadata && 
                   file.metadata.size > 0;
          })
          .map(file => ({
            filename: file.name,
            original_name: file.name.split('/').pop(),
            file_path: file.name,
            url: file.publicUrl,
            file_size: file.metadata?.size || 0,
            mime_type: file.metadata?.mimetype || this.getMimeTypeFromName(file.name),
            file_type: this.getFileTypeFromName(file.name),
            bucket_name: bucket,
            category: this.getCategoryFromPath(file.name),
            created_at: file.created_at,
            updated_at: file.updated_at
          }));
        
        allFiles.push(...validFiles);
      } catch (error) {
        console.warn(`Error fetching files from bucket ${bucket}:`, error);
      }
    }
    
    return allFiles;
  }

  // Add file metadata to database
  async addFileToDatabase(fileData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('media_library')
        .insert([{
          filename: fileData.filename,
          original_name: fileData.original_name,
          file_path: fileData.file_path,
          url: fileData.url,
          file_size: fileData.file_size,
          mime_type: fileData.mime_type,
          file_type: fileData.file_type,
          bucket_name: fileData.bucket_name,
          category: fileData.category || 'general',
          alt_text: fileData.alt_text || null,
          caption: fileData.caption || null,
          tags: fileData.tags || []
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding file to database:', error);
      throw error;
    }
  }
  // Upload file to storage and add to database
  async uploadFile(file, bucket = null, metadata = {}) {
    try {
      // Extract metadata with defaults
      const {
        category = 'general',
        alt_text = null,
        caption = null,
        tags = []
      } = metadata;

      // Determine bucket based on file type if not specified
      const targetBucket = bucket || this.getBucketForFileType(this.getFileTypeFromName(file.name));
      
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${category}/${timestamp}-${file.name}`;
      
      // Upload to storage
      const uploadResult = await storageService.uploadFile(targetBucket, file, filename);
      
      // Add to database
      const fileData = {
        filename: filename,
        original_name: file.name,
        file_path: uploadResult.path,
        url: uploadResult.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        file_type: this.getFileTypeFromName(file.name),
        bucket_name: targetBucket,
        category: category,
        alt_text: alt_text,
        caption: caption,
        tags: Array.isArray(tags) ? tags : []
      };
      
      const dbEntry = await this.addFileToDatabase(fileData);
      
      return {
        ...dbEntry,
        uploadResult
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Delete file from storage and database
  async deleteFile(mediaId, filePath, bucketName) {
    try {
      // Delete from storage
      await storageService.deleteFile(bucketName, filePath);
      
      // Delete from database
      const { error } = await supabaseAdmin
        .from('media_library')
        .delete()
        .eq('id', mediaId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Update file metadata in database
  async updateFileMetadata(mediaId, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('media_library')
        .update(updates)
        .eq('id', mediaId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating file metadata:', error);
      throw error;
    }
  }

  // Search files
  async searchFiles(searchTerm, filters = {}) {
    try {
      let query = supabase
        .from('media_library')
        .select('*');
      
      // Apply search term
      if (searchTerm) {
        query = query.or(`filename.ilike.%${searchTerm}%,original_name.ilike.%${searchTerm}%,alt_text.ilike.%${searchTerm}%,caption.ilike.%${searchTerm}%`);
      }
      
      // Apply filters
      if (filters.file_type && filters.file_type !== 'all') {
        query = query.eq('file_type', filters.file_type);
      }
      
      if (filters.bucket_name && filters.bucket_name !== 'all') {
        query = query.eq('bucket_name', filters.bucket_name);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching files:', error);
      throw error;
    }
  }

  // Helper methods
  getFileTypeFromName(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      return 'image';
    } else if (['pdf'].includes(ext)) {
      return 'pdf';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
      return 'document';
    } else if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return 'audio';
    }
    
    return 'other';
  }

  getMimeTypeFromName(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'txt': 'text/plain',
      'mp4': 'video/mp4',
      'mp3': 'audio/mpeg'
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
  }

  getBucketForFileType(fileType) {
    switch (fileType) {
      case 'image':
        return STORAGE_BUCKETS.IMAGES;
      case 'pdf':
      case 'document':
        return STORAGE_BUCKETS.DOCUMENTS;
      default:
        return STORAGE_BUCKETS.IMAGES;
    }
  }

  getCategoryFromPath(filePath) {
    const pathParts = filePath.split('/');
    if (pathParts.length > 1) {
      return pathParts[0];
    }
    return 'general';
  }

  // Get file statistics
  async getStats() {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('file_type, bucket_name, file_size');
      
      if (error) throw error;
      
      const stats = {
        total: data.length,
        byType: {},
        byBucket: {},
        totalSize: 0
      };
      
      data.forEach(file => {
        // Count by type
        stats.byType[file.file_type] = (stats.byType[file.file_type] || 0) + 1;
        
        // Count by bucket
        stats.byBucket[file.bucket_name] = (stats.byBucket[file.bucket_name] || 0) + 1;
        
        // Total size
        stats.totalSize += file.file_size || 0;
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting stats:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const mediaLibraryService = new MediaLibraryService();
export default mediaLibraryService;
