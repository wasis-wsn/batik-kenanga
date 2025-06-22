import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { productService } from '@/services/productService';
import * as XLSX from 'xlsx';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Star,
  Package,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const ProductsManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ colors: [], cap_patterns: [], tiedye_patterns: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, filtersData] = await Promise.all([
        productService.getAllProducts(),
        productService.getAllCategories(),
        productService.getAllFilters(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setFilters(filtersData || { colors: [], cap_patterns: [], tiedye_patterns: [] });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await productService.deleteProduct(productToDelete.id);
      await loadData();
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };  const toggleFeatured = async (id, currentFeatured) => {
    try {
      await productService.updateProductFields(id, { featured: !currentFeatured });
      await loadData();
      toast({
        title: 'Success',
        description: `Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };  const exportToExcel = async () => {
    try {
      setExporting(true);
      
      // Helper function to get filter names by IDs
      const getFilterNames = (filterIds, filterArray) => {
        if (!Array.isArray(filterIds)) return '';
        return filterIds.map(id => {
          const filter = filterArray.find(f => f.id === id);
          return filter ? filter.name : id;
        }).join(', ');
      };
      
      // Prepare Excel data with formatted headers
      const excelData = filteredProducts.map((product, index) => {
        const category = categories.find(cat => cat.id === product.category_id);
        
        return {
          'Nama Produk': product.name,
          'Kategori': category?.name || 'Tidak Ada Kategori',
          'Harga (IDR)': product.price,
          'Stok': product.stock,
          'Featured': product.featured ? 'Ya' : 'Tidak',
          'Deskripsi': product.description || '',
          'Material': product.material || '',
          'Ukuran': product.size || '',
          'Teknik': product.technique || '',
          'Asal': product.origin || '',
          'Proses Pewarnaan': product.coloring || '',
          'Petunjuk Perawatan': product.care_instructions || '',
          'Warna': getFilterNames(product.colors, filters.colors),
          'Motif Cap': getFilterNames(product.cap_patterns, filters.cap_patterns),
          'Motif Tie-dye': getFilterNames(product.tiedye_patterns, filters.tiedye_patterns),
          'URL Gambar': product.image_url || '',
          'Tanggal Dibuat': product.created_at ? new Date(product.created_at).toLocaleDateString('id-ID') : '',
          'Terakhir Diupdate': product.updated_at ? new Date(product.updated_at).toLocaleDateString('id-ID') : ''
        };
      });      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better formatting
      const colWidths = [
        { wch: 25 },  // Nama Produk
        { wch: 20 },  // Kategori
        { wch: 15 },  // Harga
        { wch: 8 },   // Stok
        { wch: 10 },  // Featured
        { wch: 40 },  // Deskripsi
        { wch: 15 },  // Material
        { wch: 15 },  // Ukuran
        { wch: 15 },  // Teknik
        { wch: 15 },  // Asal
        { wch: 30 },  // Proses Pewarnaan
        { wch: 30 },  // Petunjuk Perawatan
        { wch: 20 },  // Warna
        { wch: 20 },  // Motif Cap
        { wch: 20 },  // Motif Tie-dye
        { wch: 40 },  // URL Gambar
        { wch: 15 },  // Tanggal Dibuat
        { wch: 15 }   // Terakhir Diupdate
      ];
      worksheet['!cols'] = colWidths;

      // Add title and company info with proper spacing
      const titleData = [
        ['LAPORAN DATA PRODUK - BATIK KENANGA'],
        [`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`],
        [`Total Produk: ${filteredProducts.length}`],
        [''], // Empty row
        [''], // Additional empty row for better spacing
      ];

      // Create a new worksheet for title and data
      const titleWorksheet = XLSX.utils.aoa_to_sheet(titleData);
      
      // Merge cells for title
      if (!titleWorksheet['!merges']) titleWorksheet['!merges'] = [];
      titleWorksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });
      
      // Add data starting from row 6 (after title and spacing)
      XLSX.utils.sheet_add_json(titleWorksheet, excelData, { 
        origin: 'A6',
        skipHeader: false 
      });
      
      // Set column widths for the combined worksheet
      titleWorksheet['!cols'] = colWidths;      // Add the worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, titleWorksheet, 'Data Produk');

      // Create summary sheet
      const summaryData = [
        ['RINGKASAN DATA PRODUK'],
        [''],
        ['Total Produk', products.length],
        ['Produk Featured', products.filter(p => p.featured).length],
        ['Produk Stok Rendah (< 5)', products.filter(p => p.stock < 5).length],
        ['Total Kategori', categories.length],
        [''],
        ['KATEGORI PRODUK'],
        ['Nama Kategori', 'Jumlah Produk']
      ];

      // Add category breakdown
      categories.forEach(category => {
        const productCount = products.filter(p => p.category_id === category.id).length;
        summaryData.push([category.name, productCount]);
      });

      const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Ringkasan');

      // Generate file name with current date
      const fileName = `data-produk-batik-kenanga-${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save the file
      XLSX.writeFile(workbook, fileName);

      toast({
        title: 'Berhasil',
        description: 'Data produk berhasil diekspor ke Excel',
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengekspor data produk ke Excel',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
      <div className="space-y-6">        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={exportToExcel}
              disabled={exporting || filteredProducts.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              {exporting ? 'Mengekspor...' : 'Export Excel'}
            </Button>
            <Link to="/admin/products/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.featured).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => p.stock < 5).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>        {/* Products Table */}
        <Card>          <CardHeader>
            <CardTitle>Products ({filteredProducts.length})</CardTitle>
            <CardDescription>
              A list of all products in your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            {product.description?.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categories.find(cat => cat.id === product.category_id)?.name || 'No Category'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.stock < 5 ? 'destructive' : 'default'}
                      >
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {product.featured && (
                          <Badge variant="default">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/products/${product.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleFeatured(product.id, product.featured)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {product.featured ? 'Unfeature' : 'Feature'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8"
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>        </Card>

          <ConfirmationModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={confirmDeleteProduct}
  title="Delete Product"
  message={`Are you sure you want to delete "${productToDelete?.name}"?`}
  confirmText="Delete"
  cancelText="Cancel"
  variant="destructive"
/>
      </div>
    );
  };

  export default ProductsManagementPage;
