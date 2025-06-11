import React, { useState, useEffect } from 'react';
import { Upload, Search, Grid, List, Trash2, Eye, Image as ImageIcon, RefreshCw, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
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
  const [filterType, setFilterType] = useState('all');  const [viewMode, setViewMode] = useState('grid');
  const [storageSetupRequired, setStorageSetupRequired] = useState(false);
  const [stats, setStats] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await fetchMediaFiles();
    await loadStats();
  };

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      setStorageSetupRequired(false);
      
      // Get files from database (which should be synced with storage)
      const files = await mediaLibraryService.getAllMediaFiles();
      setMediaFiles(files);
      
      console.log(`Loaded ${files.length} files from database`);
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
      
      // Reload data after sync
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

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      
      for (const file of files) {
        await mediaLibraryService.uploadFile(file, 'general');
      }

      toast({
        title: "Success",
        description: `${files.length} file(s) uploaded successfully`,
      });
      
      // Reload data after upload
      await loadInitialData();
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
    }    setShowDeleteModal(false);
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
    const fileType = getFileTypeFromName(fileName);
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
        <div className="flex gap-2">
          <Button
            onClick={handleSyncStorage}
            variant="outline"
            disabled={syncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Storage'}
          </Button>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept="image/*,application/pdf,.doc,.docx"
          />
          <Button
            onClick={() => document.getElementById('file-upload').click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Files'}
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
      )}

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

      {/* Files Display */}
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
              <p className="text-gray-600">No files found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {getFileTypeFromName(file.filename) === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.original_name}
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
                        {getFileTypeFromName(file.filename)}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(getFileTypeFromName(file.filename))}
                    <div>
                      <p className="font-medium">{file.original_name || file.filename}</p>
                      <p className="text-sm text-gray-500">
                        {getFileSize(file.file_size)} • {file.bucket_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {getFileTypeFromName(file.filename)}
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
          )}        </CardContent>
      </Card>

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
