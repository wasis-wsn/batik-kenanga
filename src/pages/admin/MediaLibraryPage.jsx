import React, { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Trash2, Eye, Image as ImageIcon, RefreshCw, Copy, Folder, FileImage } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../components/ui/use-toast';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { mediaLibraryService } from '../../services/mediaLibraryService';
import StorageSetupPrompt from '../../components/admin/StorageSetupPrompt';

const MediaLibraryPage = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [storageSetupRequired, setStorageSetupRequired] = useState(false);
  const [stats, setStats] = useState(null);  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('media'); // Track active tab
  
  // Upload modal states
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    category: 'general',
    alt_text: '',
    caption: '',
    tags: '',
    bucket: 'images' // 'images' for media files, 'documents' for gallery
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  // Reset filter when switching tabs
  useEffect(() => {
    setFilterType('all');
  }, [activeTab]);

  const loadInitialData = async () => {
    await fetchMediaFiles();
    await loadStats();
  };

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      setStorageSetupRequired(false);
        const files = await mediaLibraryService.getAllMediaFiles();
      setMediaFiles(files);
    } catch (error) {
      console.error('Error fetching media files:', error);
      setStorageSetupRequired(true);
      setMediaFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await mediaLibraryService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSyncStorage = async () => {
    try {
      setSyncing(true);
      
      const syncResult = await mediaLibraryService.syncStorageWithDatabase();
      
      toast({
        title: "Sync Complete",
        description: `Added ${syncResult.addedToDb} files to database. Found ${syncResult.storageFiles} storage files, ${syncResult.dbFiles} database entries.`,
      });
      
      await loadInitialData();
    } catch (error) {
      console.error('Error syncing storage:', error);
      toast({
        title: "Sync Error",
        description: "Failed to sync storage with database",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadData(prev => ({ ...prev, file: files[0] }));
    }
  };

  const handleFileUpload = async () => {
    if (!uploadData.file) return;

    try {
      setUploading(true);
      
      await mediaLibraryService.uploadFile(uploadData.file, uploadData.bucket, {
        category: uploadData.category,
        alt_text: uploadData.alt_text,
        caption: uploadData.caption,
        tags: uploadData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
      
      await loadInitialData();
      setShowUpload(false);
      setUploadData({
        file: null,
        category: 'general',
        alt_text: '',
        caption: '',
        tags: '',
        bucket: 'images'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (file) => {
    setFileToDelete(file);
    setShowDeleteModal(true);
  };

  const confirmDeleteFile = async () => {
    if (fileToDelete) {
      try {
        await mediaLibraryService.deleteFile(fileToDelete.id, fileToDelete.file_path, fileToDelete.bucket_name);
        toast({
          title: "Success",
          description: "File deleted successfully",
        });
        await loadInitialData();
      } catch (error) {
        console.error('Error deleting file:', error);
        toast({
          title: "Error",
          description: "Failed to delete file",
          variant: "destructive",
        });
      }
    }
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const getFileTypeFromName = (fileName) => {
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
    return <ImageIcon className="h-4 w-4" />;
  };
  const filteredFiles = mediaFiles.filter(file => {
    const fileName = file.original_name || file.filename;
    const matchesSearch = fileName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Different filter logic for gallery vs media
    let matchesFilter;
    if (activeTab === 'gallery') {
      // For gallery, filter by category
      matchesFilter = filterType === 'all' || file.category === filterType;
    } else {
      // For media, filter by file type
      const fileType = getFileTypeFromName(fileName);
      matchesFilter = filterType === 'all' || fileType === filterType;
    }
    
    return matchesSearch && matchesFilter;
  });// Get media files (images bucket) and gallery files (documents bucket)
  // If bucket_name is not available, treat all files as media files for backward compatibility
  const mediaOnlyFiles = filteredFiles.filter(file => !file.bucket_name || file.bucket_name === 'images');
  const galleryOnlyFiles = filteredFiles.filter(file => file.bucket_name === 'documents');

  // Define proper gallery categories
  const galleryCategories = ['all', 'galeri', 'produk', 'proses', 'tim', 'event'];
  const mediaCategories = ['all', 'general', 'product', 'news', 'banner'];
  
  // Use appropriate categories based on active tab
  const allCategories = activeTab === 'gallery' ? galleryCategories : mediaCategories;

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
          <p className="text-gray-600">Manage your media files and gallery</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSyncStorage}
            variant="outline"
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Storage'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Files</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.byType.image || 0}</div>
              <div className="text-sm text-gray-600">Images</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.byType.pdf || 0}</div>
              <div className="text-sm text-gray-600">PDFs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{getFileSize(stats.totalSize)}</div>
              <div className="text-sm text-gray-600">Total Size</div>
            </CardContent>
          </Card>
        </div>
      )}      {/* Tabs Implementation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Media Files ({mediaOnlyFiles.length})
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <FileImage className="h-4 w-4" />
            Gallery ({galleryOnlyFiles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="media">
          <div className="space-y-4">            {/* Media Upload and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">                <Button
                  onClick={() => {
                    setUploadData(prev => ({ ...prev, bucket: 'images' }));
                    setActiveTab('media');
                    setShowUpload(true);
                  }}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Media Files'}
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="image">Images</option>
                      <option value="pdf">PDFs</option>
                      <option value="document">Documents</option>
                      <option value="audio">Audio</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Files Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media Files ({mediaOnlyFiles.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mediaOnlyFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No media files found</p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {mediaOnlyFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          {getFileTypeFromName(file.filename) === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.alt_text || file.original_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400">
                              {getFileIcon(getFileTypeFromName(file.filename))}
                            </div>
                          )}
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs font-medium truncate">{file.original_name || file.filename}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.category || getFileTypeFromName(file.filename)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  •••
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                                  <Copy className="h-4 w-4 mr-2" />
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
                          {file.caption && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{file.caption}</p>
                          )}
                          {file.tags && file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mediaOnlyFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {getFileIcon(getFileTypeFromName(file.filename))}
                          <div>
                            <p className="font-medium">{file.original_name || file.filename}</p>
                            <p className="text-sm text-gray-500">
                              {getFileSize(file.file_size)} • {file.category || 'Uncategorized'}
                            </p>
                            {file.caption && (
                              <p className="text-sm text-gray-600">{file.caption}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {file.category || getFileTypeFromName(file.filename)}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                                <Copy className="h-4 w-4 mr-2" />
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="space-y-4">
            {/* Gallery Upload and Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-2">                <Button
                  onClick={() => {
                    setUploadData(prev => ({ ...prev, bucket: 'documents', category: 'galeri' }));
                    setActiveTab('gallery');
                    setShowUpload(true);
                  }}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to Gallery
                </Button>
              </div>
            </div>

            {/* Gallery Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search gallery..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >                      {allCategories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : 
                           category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gallery Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Gallery Images ({galleryOnlyFiles.length})
                </CardTitle>
              </CardHeader>              <CardContent>
                {(() => {
                  if (galleryOnlyFiles.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No gallery images found</p>
                      </div>
                    );
                  }
                  
                  if (viewMode === 'grid') {
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {galleryOnlyFiles.map((file) => (
                      <Card key={file.id} className="overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={file.url}
                            alt={file.alt_text || file.original_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs font-medium truncate">{file.original_name}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.category || 'Gallery'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  •••
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                                  <Copy className="h-4 w-4 mr-2" />
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
                          {file.caption && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{file.caption}</p>
                          )}
                          {file.tags && file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {file.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {file.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{file.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}                        </CardContent>
                      </Card>
                    ))}
                      </div>
                    );
                  }
                    // Gallery List View
                  return (
                    <div className="space-y-2">
                      {galleryOnlyFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={file.url}
                              alt={file.alt_text || file.original_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{file.alt_text || file.original_name}</p>
                            <p className="text-sm text-gray-500">
                              {getFileSize(file.file_size)} • {file.category || 'Gallery'}
                            </p>
                            {file.caption && (
                              <p className="text-sm text-gray-600">{file.caption}</p>
                            )}
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {file.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {file.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{file.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {file.category || 'Gallery'}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                •••
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy URL
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteFile(file)}
                                className="text-red-600"
                              >                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">          <DialogHeader>
            <DialogTitle>
              {uploadData.bucket === 'documents' ? 'Upload Gallery Image' : 'Upload Media File'}
            </DialogTitle>
            <DialogDescription>
              {uploadData.bucket === 'documents' 
                ? 'Add a new image to the gallery with category and description.'
                : 'Upload a new media file with metadata.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-input">Select File</Label>              <Input
                id="file-input"
                type="file"
                accept={uploadData.bucket === 'documents' ? 'image/*' : 'image/*,application/pdf,.doc,.docx'}
                onChange={handleFileSelect}
              />
              {uploadData.file && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Selected: {uploadData.file.name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={uploadData.category} 
                onValueChange={(value) => setUploadData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>                <SelectContent>
                  {uploadData.bucket === 'documents' ? (
                    <>
                      <SelectItem value="galeri">Galeri</SelectItem>
                      <SelectItem value="produk">Produk</SelectItem>
                      <SelectItem value="proses">Proses</SelectItem>
                      <SelectItem value="tim">Tim</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="alt-text">Alt Text</Label>
              <Input
                id="alt-text"
                placeholder="Describe the image..."
                value={uploadData.alt_text}
                onChange={(e) => setUploadData(prev => ({ ...prev, alt_text: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="caption">Caption (Optional)</Label>
              <Textarea
                id="caption"
                placeholder="Image caption..."
                value={uploadData.caption}
                onChange={(e) => setUploadData(prev => ({ ...prev, caption: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (Optional)</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3..."
                value={uploadData.tags}
                onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => document.getElementById('file-input').click()}
                variant="outline"
                disabled={uploading}
              >
                Select File
              </Button>
              <Button 
                onClick={handleFileUpload}
                disabled={uploading || !uploadData.file}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.original_name || fileToDelete?.filename}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default MediaLibraryPage;
