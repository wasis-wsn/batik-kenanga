import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { useToast } from '../../components/ui/use-toast';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { supabaseAdmin } from '../../services/supabase';
import { categoryService } from '../../services/categoryService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';

const CategoriesManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [filterType, setFilterType] = useState('colors');
  const [filterName, setFilterName] = useState('');
  const [creatingFilter, setCreatingFilter] = useState(false);
  const [filters, setFilters] = useState({ colors: [], cap_patterns: [], tiedye_patterns: [] });
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteFilterModal, setShowDeleteFilterModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [filterToDelete, setFilterToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchFilters();
  }, []);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      // Fetch all filter types from database
      const [colorsRes, capRes, tiedyeRes] = await Promise.all([
        supabaseAdmin.from('colors').select('*').order('name'),
        supabaseAdmin.from('cap_patterns').select('*').order('name'),
        supabaseAdmin.from('tiedye_patterns').select('*').order('name')
      ]);

      setFilters({
        colors: colorsRes.data || [],
        cap_patterns: capRes.data || [],
        tiedye_patterns: tiedyeRes.data || []
      });
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };  const handleDelete = (id) => {
    setCategoryToDelete(id);
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.deleteCategory(categoryToDelete);
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    }    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
  };

  const handleCreateFilter = async () => {
    if (!filterName.trim()) return;
    
    setCreatingFilter(true);
    try {
      // Tentukan tabel berdasarkan filterType
      const tableName = filterType; // colors, cap_patterns, atau tiedye_patterns
        // Insert ke database Supabase
      const { error } = await supabaseAdmin
        .from(tableName)
        .insert([{ name: filterName.trim() }]);
      
      if (error) {
        throw error;
      }
      
      toast({ 
        title: 'Success', 
        description: `Added ${filterType.replace('_', ' ')}: ${filterName}` 
      });
      
      setFilterName('');
      setShowAddFilter(false);
      
      // Refresh filters after creating new one
      fetchFilters();
    } catch (error) {
      console.error('Error creating filter:', error);
      toast({ 
        title: 'Error', 
        description: `Failed to add ${filterType.replace('_', ' ')}`, 
        variant: 'destructive' 
      });
    } finally {
      setCreatingFilter(false);
    }
  };
  const handleDeleteFilter = (filterType, filterId, filterName) => {
    setFilterToDelete({ type: filterType, id: filterId, name: filterName });
    setShowDeleteFilterModal(true);
  };

  const confirmDeleteFilter = async () => {
    if (filterToDelete) {
      try {
        const { error } = await supabaseAdmin
          .from(filterToDelete.type)
          .delete()
          .eq('id', filterToDelete.id);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Success",
          description: `Deleted ${filterToDelete.type.replace('_', ' ')}: ${filterToDelete.name}`,
        });
        
        // Refresh filters after deletion
        fetchFilters();
      } catch (error) {
        console.error('Error deleting filter:', error);
        toast({
          title: "Error",
          description: `Failed to delete ${filterToDelete.type.replace('_', ' ')}`,
          variant: "destructive",
        });
      }
    }
    setShowDeleteFilterModal(false);
    setFilterToDelete(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowAddFilter(true)} variant="secondary">
            + Add Colors/Cap/TieDye
          </Button>
          <Button onClick={() => window.location.href = '/admin/categories/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>        </div>
      </div>

      {/* Modal Add Filter */}
      <Dialog open={showAddFilter} onOpenChange={setShowAddFilter}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Colors/Cap Patterns/TieDye Patterns</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filterType">Type</Label>
              <select
                id="filterType"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="colors">Colors</option>
                <option value="cap_patterns">Cap Patterns</option>
                <option value="tiedye_patterns">TieDye Patterns</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterName">Name</Label>
              <Input
                id="filterName"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                placeholder={`Enter ${filterType.replace('_', ' ')} name`}
                onKeyPress={e => {
                  if (e.key === 'Enter' && !creatingFilter && filterName.trim()) {
                    handleCreateFilter();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddFilter(false)}
              disabled={creatingFilter}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFilter} 
              disabled={creatingFilter || !filterName.trim()}
            >
              {creatingFilter ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No categories found</p>
            </div>
          ) : (            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.image_url && (
                          <img src={category.image_url} alt={category.name} className="w-16 h-10 object-cover rounded" />
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {category.description || '-'}
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
                              onClick={() => window.location.href = `/admin/categories/${category.id}/edit`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(category.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Filter Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Filter Management
          </CardTitle>
        </CardHeader>        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colors */}
            <div>
              <h3 className="font-medium mb-3">Colors ({filters.colors.length})</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filters.colors.map((color) => (
                  <div key={color.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{color.name}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteFilter('colors', color.id, color.name)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {filters.colors.length === 0 && (
                  <p className="text-gray-500 text-sm">No colors found</p>
                )}
              </div>
            </div>

            {/* Cap Patterns */}
            <div>
              <h3 className="font-medium mb-3">Cap Patterns ({filters.cap_patterns.length})</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filters.cap_patterns.map((pattern) => (
                  <div key={pattern.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{pattern.name}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteFilter('cap_patterns', pattern.id, pattern.name)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {filters.cap_patterns.length === 0 && (
                  <p className="text-gray-500 text-sm">No cap patterns found</p>
                )}
              </div>
            </div>

            {/* TieDye Patterns */}
            <div>
              <h3 className="font-medium mb-3">TieDye Patterns ({filters.tiedye_patterns.length})</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filters.tiedye_patterns.map((pattern) => (
                  <div key={pattern.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{pattern.name}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteFilter('tiedye_patterns', pattern.id, pattern.name)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {filters.tiedye_patterns.length === 0 && (
                  <p className="text-gray-500 text-sm">No tiedye patterns found</p>
                )}
              </div>
            </div>
          </div>        </CardContent>
      </Card>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteCategoryModal}
        onClose={() => setShowDeleteCategoryModal(false)}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showDeleteFilterModal}
        onClose={() => setShowDeleteFilterModal(false)}
        onConfirm={confirmDeleteFilter}
        title="Delete Filter"
        message={`Are you sure you want to delete "${filterToDelete?.name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default CategoriesManagementPage;
