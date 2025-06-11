import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../components/ui/use-toast';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { getAllTestimonials, deleteTestimonial, deleteTestimonialFiles } from '../../services/supabase';

const TestimonialsManagementPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getAllTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };  const handleDelete = (id) => {
    setTestimonialToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (testimonialToDelete) {
      try {
        // Delete associated files first
        await deleteTestimonialFiles(testimonialToDelete);
        // Then delete the testimonial record
        await deleteTestimonial(testimonialToDelete);
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        });
        fetchTestimonials();
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast({
          title: "Error",
          description: "Failed to delete testimonial",
          variant: "destructive",
        });
      }
    }
    setShowDeleteModal(false);
    setTestimonialToDelete(null);
  };

  const filteredTestimonials = testimonials.filter(testimonial => {    const matchesSearch = 
      testimonial.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.feedback.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.product_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && testimonial.is_featured) ||
      (statusFilter === 'inactive' && !testimonial.is_featured);
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
          <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <Button onClick={() => window.location.href = '/admin/testimonials/new'} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search testimonials..."
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
              <option value="all">All Testimonials</option>
              <option value="active">Featured</option>
              <option value="inactive">Not Featured</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Testimonials ({filteredTestimonials.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTestimonials.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No testimonials found</p>
            </div>          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {testimonial.image_url ? (
                            <img
                              src={testimonial.image_url}
                              alt={testimonial.customer_name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{testimonial.customer_name}</div>
                            {testimonial.customer_location && (
                              <div className="text-sm text-gray-500">
                                {testimonial.customer_location}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="text-sm">
                          {truncateText(testimonial.feedback, 150)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {testimonial.product_name || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={testimonial.is_featured ? 'default' : 'secondary'}>
                          {testimonial.is_featured ? 'Featured' : 'Regular'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(testimonial.created_at).toLocaleDateString()}
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
                              onClick={() => window.location.href = `/admin/testimonials/${testimonial.id}/edit`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(testimonial.id)}
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This will also delete all associated files."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default TestimonialsManagementPage;
