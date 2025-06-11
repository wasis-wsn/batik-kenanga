import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../components/ui/use-toast';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { getAllNews, deleteNews, deleteNewsFiles } from '../../services/supabase';

const NewsManagementPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };  const handleDelete = (id) => {
    setNewsToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (newsToDelete) {
      try {
        // Delete associated files first
        await deleteNewsFiles(newsToDelete);
        // Then delete the news record
        await deleteNews(newsToDelete);
        toast({
          title: "Success",
          description: "News article deleted successfully",
        });
        fetchNews();
      } catch (error) {
        console.error('Error deleting news:', error);
        toast({
          title: "Error",
          description: "Failed to delete news article",
          variant: "destructive",
        });
      }
    }
    setShowDeleteModal(false);
    setNewsToDelete(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { variant: 'default', label: 'Published' },
      draft: { variant: 'secondary', label: 'Draft' },
      archived: { variant: 'outline', label: 'Archived' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredNews = news.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/news/new'} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add News Article
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* News Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            News Articles ({filteredNews.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredNews.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No news articles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Excerpt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published Date</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNews.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{article.title}</div>
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <div className="text-sm text-gray-600">
                          {truncateText(article.excerpt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(article.status)}
                      </TableCell>
                      <TableCell>
                        {article.published_at 
                          ? new Date(article.published_at).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{article.views || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(article.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/news/${article.id}/edit`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.open(`/news/${article.slug}`, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete News Article"
        message="Are you sure you want to delete this news article? This will also delete all associated files."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default NewsManagementPage;
