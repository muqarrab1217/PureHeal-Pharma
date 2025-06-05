import React, { useState, useEffect, useCallback  } from 'react';
import { Search, Plus, Edit, Trash2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

interface ApiResponse {
  data: Product[];
  total: number;
  page: number;
  pages: number;
}

const ProductsPage: React.FC = () => {
  const { suppliers, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async (page = 1, query = '') => {
    setLoading(true);
    try {
      let apiResponse: ApiResponse;

      if (query.trim() === '') {
        // Fetch paginated products normally
        const res = await fetch(`http://localhost:3000/api/medicines/getMedicines?page=${page}`);
        apiResponse = await res.json();
        setTotalPages(apiResponse.pages || 1);
        setTotalProducts(apiResponse.total || 0);
      } else {
        // Fetch search results, assuming search API returns full results without pagination
        const res = await fetch(`http://localhost:3000/api/medicines/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        // Construct apiResponse to keep consistent interface
        apiResponse = {
          data: data.data || data || [],  // adjust based on API response format
          total: data.total || (data.data ? data.data.length : data.length),
          page: 1,
          pages: 1,
        };
        setTotalPages(1);
        setTotalProducts(apiResponse.total);
      }

      setProducts(apiResponse.data || []);
      // On search mode, currentPage should be 1
      if (query.trim() !== '') {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/categories/getCategories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    if (isModalOpen) fetchCategories();
  }, [isModalOpen]);

  // Effect to fetch products either by pagination or by searchTerm
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    // Debounce search: wait 400ms after last keystroke before sending request
    const timeout = setTimeout(() => {
      fetchProducts(currentPage, searchTerm);
    }, 400);

    setSearchTimeout(timeout);

    // Cleanup on unmount or on next effect call
    return () => clearTimeout(timeout);
  }, [currentPage, searchTerm]);

  // Filter by category - only filter client-side on current products (search and pagination results)
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.Category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentProduct({
      Name: '',
      sku: '',
      barcode: '',
      Category: categories[0]?.id || '',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 0,
      Strength: '',
      'Dosage Form': '',
      Indication: '',
      Classification: '',
      image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      supplier: suppliers[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find(p => p.id === productId || p._id === productId);
    if (productToEdit) {
      setIsEditing(true);
      setCurrentProduct({
        ...productToEdit,
        id: productToEdit._id || productToEdit.id, // Use _id if available, fallback to id
      });
      setIsModalOpen(true);
    } else {
      console.error('Product not found for ID:', productId);
      alert('Error: Product not found.');
    }
  };

  const handleSaveProduct = async () => {
    if (!currentProduct) return;

    const requiredFields = [
      { field: currentProduct.Name?.trim(), name: "Product Name" },
      { field: currentProduct.Category, name: "Category" },
      { field: currentProduct["Dosage Form"], name: "Dosage Form" },
      { field: currentProduct.Strength, name: "Strength" },
      //{ field: currentProduct.barcode?.trim(), name: "Barcode" },
      //{ field: currentProduct.sku?.trim(), name: "SKU" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field || (typeof field === 'string' && field.trim() === '')) {
        alert(`${name} is required`);
        return;
      }
    }

    const productData = {
      Name: currentProduct.Name?.trim(),
      Category: currentProduct.Category,
      "Dosage Form": currentProduct["Dosage Form"],
      Strength: currentProduct.Strength,
      Manufacturer: currentProduct.supplier || '',
      Indication: currentProduct.Indication || '',
      Classification: currentProduct.Classification || '',
      price: Number(currentProduct.price) || 0,
      cost: Number(currentProduct.cost) || 0,
      stock: Number(currentProduct.stock) || 0,
      Barcode: currentProduct.barcode?.trim(),
      SKU: currentProduct.sku?.trim(),
      minStock: currentProduct.minStock || 5
    };

    console.log('Product Data:', productData);

    try {
      let response;
      
      if (isEditing && currentProduct.id) {
        // Update existing product
        response = await fetch(`http://localhost:3000/api/medicines/update-medicine/${currentProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      } else {
        // Create new product
        response = await fetch('http://localhost:3000/api/medicines/create-medicine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        console.error('Backend error:', data);
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
      setIsModalOpen(false);
      setCurrentProduct(null);
      fetchProducts(); // Refresh product list
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async (product: Product) => {
    //if (!confirm(`Are you sure you want to delete ${product.Name}?`)) return;

    try {
      const productId = product._id || product.id;
      const response = await fetch(`http://localhost:3000/api/medicines/delete-medicine/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete medicine');
      }

      const result = await response.json();
      console.log(result.message);

      alert('Product deleted successfully!');
      // Refresh product list
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Error deleting medicine');
    }
  };

  const confirmDelete = () => {
    if (productToDelete) {
      handleDelete(productToDelete);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button icon={<Plus size={18} />} onClick={handleAddNew}>
          Add New Product
        </Button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={18} className="text-gray-400" />}
            fullWidth
          />
          
          <Select
            placeholder="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat.name, label: cat.name }))
            ]}
            fullWidth
          />
          
          <div className="text-right md:col-span-1">
            <span className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products on page {currentPage}
            </span>
            <br />
            <span className="text-xs text-gray-400">
              Total: {totalProducts.toLocaleString()} products ({totalPages} pages)
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term or category</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU / Barcode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage Form
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Strength
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const isLowStock = product.stock <= (product.minStock || 0);
                    
                    return (
                      <tr key={product._id || product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={product.image || 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} 
                                alt={product.Name} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.Name}</div>
                              <Badge variant="primary">{product.Category || 'Unknown'}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.sku || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{product.barcode || 'N/A'}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product["Dosage Form"] || 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.Indication || 'N/A'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.Strength || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rs. {(product.price || 0).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Cost: Rs. {(product.cost || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {product.stock || 0}
                          </div>
                          {isLowStock && (
                            <Badge variant="danger">Low Stock</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mr-2"
                            icon={<Edit size={16} />}
                            onClick={() => handleEditProduct(product._id || product.id)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50"
                            icon={<Trash2 size={16} />}
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500">
                  Page {currentPage} of {totalPages} ({totalProducts.toLocaleString()} total products)
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    icon={<ChevronLeft size={16} />}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className="min-w-[2.5rem]"
                      >
                        {pageNumber}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    icon={<ChevronRight size={16} />}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentProduct(null);
        }}
        title={isEditing ? 'Edit Product' : 'Add New Product'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                setCurrentProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        }
      >
        {currentProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Product Name"
                value={currentProduct.Name || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, Name: e.target.value })}
                fullWidth
                required
              />
            </div>
            
            <div>
              <Input
                label="SKU"
                value={currentProduct.sku || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, sku: e.target.value })}
                fullWidth
                required
              />
            </div>
            
            <div>
              <Input
                label="Barcode"
                value={currentProduct.barcode || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, barcode: e.target.value })}
                fullWidth
                required
              />
            </div>

            <div>
              <Input
                label="Strength"
                value={currentProduct.Strength || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, Strength: e.target.value })}
                fullWidth
                required
              />
            </div>
{/* 
            <div>
              <Input
                label="Dosage Form"
                value={currentProduct['Dosage Form'] || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, ['Dosage Form']: e.target.value })}
                fullWidth
                required
              />
            </div>

            <div>
              <Input
                label="Indication"
                value={currentProduct.Indication || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, Indication: e.target.value })}
                fullWidth
              />
            </div>

            <div>
              <Input
                label="Classification"
                value={currentProduct.Classification || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, Classification: e.target.value })}
                fullWidth
              />
            </div>
*/}
            <div>
              <Select
                label="Category"
                value={currentProduct.Category || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, Category: e.target.value })}
                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                fullWidth
                required
              />
            </div>
            
            <div>
              <Input
                label="Supplier / Manufacturer"
                value={currentProduct.supplier || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, supplier: e.target.value })}
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="Price (Rs)"
                type="number"
                min="0"
                step="0.01"
                value={currentProduct.price || 0}
                onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="Cost (Rs)"
                type="number"
                min="0"
                step="0.01"
                value={currentProduct.cost || 0}
                onChange={(e) => setCurrentProduct({ ...currentProduct, cost: Number(e.target.value) })}
                fullWidth
              />
            </div>
            
            <div>
              <Input
                label="Current Stock"
                type="number"
                min="0"
                value={currentProduct.stock || 0}
                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                fullWidth
              />
            </div>
            <div>
              <Input
                label="Minimum Stock"
                type="number"
                min="0"
                value={currentProduct.minStock || 0}
                onChange={(e) => setCurrentProduct({ ...currentProduct, minStock: Number(e.target.value) })}
                fullWidth
              />
            </div>
          </div>
        )}
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        title="Confirm Delete"
        footer={
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to delete the product "{productToDelete?.Name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProductsPage;