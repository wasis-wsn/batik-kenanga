import React, { useState, useEffect } from 'react';
import { Upload, Search, Filter, Grid, List, Trash2, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../components/ui/use-toast';
import { storageService, STORAGE_BUCKETS } from '../../services/storageService';
import StorageSetupPrompt from '../../components/admin/StorageSetupPrompt';

const MediaLibraryPage = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [storageSetupRequired, setStorageSetupRequired] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMediaFiles();
  }, []);  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      setStorageSetupRequired(false);
      
      // Check if storage service is available first
      const storageAvailable = await storageService.checkBucketsAvailability();
      
      if (!storageAvailable) {
        setStorageSetupRequired(true);
        setMediaFiles([]);
        return;
      }      // Get files from all relevant buckets
      const allFiles = [];
      const buckets = [STORAGE_BUCKETS.IMAGES, STORAGE_BUCKETS.DOCUMENTS, STORAGE_BUCKETS.COMPANY];
      
      for (const bucket of buckets) {
        try {
          let files = [];
            if (bucket === STORAGE_BUCKETS.COMPANY) {
            // For company bucket, get files from specific subfolders
            try {
              const logoFiles = await storageService.listFiles(bucket, 'logos');
              const heroFiles = await storageService.listFiles(bucket, 'hero-images');
              files = [...logoFiles, ...heroFiles];
              console.log('Company bucket files loaded:', files.length, 'files');
            } catch (error) {
              console.warn(`Error fetching company subfolders:`, error);
              // Fallback to root folder listing
              files = await storageService.listFiles(bucket);
            }
          } else {
            // For other buckets, get files from root
            files = await storageService.listFiles(bucket);
          }          const filesWithType = files
            .filter(file => {
              // Filter out placeholder files and folders
              const isValid = !file.name.includes('.emptyFolderPlaceholder') && 
                             file.metadata && 
                             file.metadata.size > 0;
              if (!isValid) {
                console.log('Filtering out file:', file.name, file.metadata);
              }
              return isValid;
            })
            .map(file => ({
              ...file,
              type: getFileTypeFromName(file.name),
              bucket: bucket,
              name: file.name,
              size: file.metadata?.size || 0,
              created_at: file.created_at,
              updated_at: file.updated_at,
              file_path: file.fullPath,
              url: file.publicUrl
            }));
          console.log(`Bucket ${bucket}: ${filesWithType.length} files added`);
          allFiles.push(...filesWithType);
        } catch (error) {
          console.warn(`Error fetching files from bucket ${bucket}:`, error);
          // Don't show error for individual bucket failures - just log them
        }
      }
      
      setMediaFiles(allFiles);
    } catch (error) {
      console.error('Error fetching media files:', error);
      setStorageSetupRequired(true);
    } finally {
      setLoading(false);
    }
  };
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        // Determine the appropriate bucket based on file type
        const fileType = getFileTypeFromName(file.name);
        let bucket;
          switch (fileType) {
          case 'image':
            bucket = STORAGE_BUCKETS.IMAGES;
            break;
          case 'document':
          case 'pdf':
            bucket = STORAGE_BUCKETS.DOCUMENTS;
            break;
          default:
            bucket = STORAGE_BUCKETS.IMAGES; // Default to images bucket
        }
        
        await storageService.uploadFile(bucket, file);
      }

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
      
      fetchMediaFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  const handleDeleteFile = async (file) => {
    if (window.confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        await storageService.deleteFile(file.bucket, file.name);
        toast({
          title: "Success",
          description: "File deleted successfully",
        });
        fetchMediaFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        });
      }
    }
  };  const getFileTypeFromName = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['pdf'].includes(extension)) {
      return 'pdf';
    } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
      return 'document';
    } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
      return 'audio';
    }
    return 'other';
  };

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <ImageIcon className="h-4 w-4" />;
    }
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const fileType = getFileTypeFromName(file.name);
    const matchesFilter = filterType === 'all' || fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Success",
      description: "URL copied to clipboard",
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (storageSetupRequired) {
    return <StorageSetupPrompt onRetry={fetchMediaFiles} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your media files and assets</p>
        </div>
        <div className="flex items-center gap-2">          <input
            type="file"
            multiple
            accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="fileUpload"
          />
          <Button
            onClick={() => document.getElementById('fileUpload').click()}
            disabled={uploading}
            className="w-full sm:w-auto"
          >
            {uploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload Files
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="audio">Audio</option>
                <option value="document">Documents</option>
                <option value="pdf">PDFs</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Files */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Media Files ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No media files found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredFiles.map((file, index) => (
                <div key={index} className="group relative border rounded-lg overflow-hidden">
                  {getFileTypeFromName(file.name) === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      {getFileIcon(getFileTypeFromName(file.name))}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => copyToClipboard(file.url)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteFile(file)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{file.name}</p>                    <div className="flex items-center justify-between mt-1">
                      <Badge variant="outline" className="text-xs">
                        {getFileTypeFromName(file.name)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {getFileSize(file.size || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file, index) => (                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {getFileIcon(getFileTypeFromName(file.name))}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeFromName(file.name)}
                        </Badge>
                        <span>{getFileSize(file.size || 0)}</span>
                        <span>{new Date(file.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteFile(file)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaLibraryPage;
