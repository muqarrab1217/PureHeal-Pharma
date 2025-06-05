import React, { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Plus, Minus, ShoppingCart, CreditCard, Check, X, User, Printer, Package } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { useAppContext } from '../context/AppContext';
import { Customer } from '../types';

const POSTerminal: React.FC = () => {
  const { 
    products, 
    customers, 
    cart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    createTransaction,
    currentUser,
    settings
  } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [receiptModal, setReceiptModal] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * (settings.taxRate / 100);
  const total = subtotal + tax - discount;
  const change = amountPaid - total > 0 ? amountPaid - total : 0;

  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.barcode.includes(searchTerm) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  useEffect(() => {
    if (total > 0) {
      setAmountPaid(total);
    }
  }, [total]);

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, 1);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateCartItem(id, quantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleCompleteTransaction = () => {
    if (cart.length === 0) return;
    
    createTransaction({
      items: cart,
      customer: selectedCustomer,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      cashier: currentUser.username,
    });
    
    setShowCheckout(false);
    setReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    window.print();
    setReceiptModal(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">POS Terminal</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            icon={<ShoppingCart size={18} />}
            onClick={() => setShowCheckout(true)}
            disabled={cart.length === 0}
          >
            Checkout ({cart.length})
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Cart */}
        <div className="lg:col-span-1">
          <Card title="Shopping Cart" className="h-full">
            <div className="flex justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => clearCart()} 
                disabled={cart.length === 0}
                icon={<Trash2 size={16} />}
              >
                Clear Cart
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCustomerModal(true)}
                  icon={<User size={16} />}
                >
                  {selectedCustomer ? selectedCustomer.name : 'Select Customer'}
                </Button>
              </div>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-10">
                <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <button 
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mx-2 min-w-[30px] text-center">{item.quantity}</span>
                        <button 
                          className="p-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="text-sm font-medium">${item.subtotal.toFixed(2)}</div>
                        <button 
                          className="text-danger-500 text-sm hover:text-danger-700"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <Button
                className="w-full mt-4"
                size="lg"
                disabled={cart.length === 0}
                onClick={() => setShowCheckout(true)}
                icon={<ShoppingCart size={20} />}
              >
                Checkout
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Right Column - Products */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <div className="mb-4">
              <Input
                placeholder="Search products by name, barcode or SKU..."
                leftIcon={<Search size={18} className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
              />
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[calc(100vh-250px)]">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleAddToCart(product)}
                  >
                    <div className="relative h-32 bg-gray-200">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {product.stock <= product.minStock && (
                        <span className="absolute top-2 right-2 bg-danger-500 text-white text-xs px-2 py-1 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-primary-600 font-bold">${product.price.toFixed(2)}</span>
                        <span className="text-gray-500 text-sm">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Customer Selection Modal */}
      <Modal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Select Customer"
        footer={
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedCustomer(null)}
              disabled={!selectedCustomer}
            >
              Clear Selection
            </Button>
            <Button onClick={() => setShowCustomerModal(false)}>
              Confirm
            </Button>
          </div>
        }
      >
        <Input
          placeholder="Search customers..."
          leftIcon={<Search size={18} className="text-gray-400" />}
          className="mb-4"
          fullWidth
        />
        <div className="max-h-[400px] overflow-y-auto">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedCustomer?.id === customer.id
                  ? 'bg-primary-50 border border-primary-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              {selectedCustomer?.id === customer.id && (
                <Check size={20} className="text-primary-600" />
              )}
            </div>
          ))}
        </div>
      </Modal>
      
      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title="Checkout"
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowCheckout(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteTransaction}
              disabled={cart.length === 0 || amountPaid < total}
              icon={<Check size={18} />}
            >
              Complete Sale
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{item.quantity}x</span> {item.name}
                  </div>
                  <div className="font-medium">${item.subtotal.toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({settings.taxRate}%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Payment Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 border rounded-md bg-gray-50">
                    {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomerModal(true)}
                  >
                    Change
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <Select
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Card', label: 'Credit/Debit Card' },
                    { value: 'Mobile', label: 'Mobile Payment' },
                  ]}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value))}
                  fullWidth
                />
              </div>
              
              {amountPaid >= total && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex justify-between font-medium">
                    <span>Change</span>
                    <span>${change.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
      
      {/* Receipt Modal */}
      <Modal
        isOpen={receiptModal}
        onClose={() => setReceiptModal(false)}
        title="Receipt"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setReceiptModal(false)}
            >
              Close
            </Button>
            <Button
              onClick={handlePrintReceipt}
              icon={<Printer size={18} />}
            >
              Print Receipt
            </Button>
          </div>
        }
      >
        <div ref={receiptRef} className="p-4 bg-white max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{settings.storeName}</h2>
            <p className="text-sm text-gray-500">{settings.address}</p>
            <p className="text-sm text-gray-500">{settings.phone}</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Cashier:</span>
              <span>{currentUser.username}</span>
            </div>
            {selectedCustomer && (
              <div className="flex justify-between text-sm">
                <span>Customer:</span>
                <span>{selectedCustomer.name}</span>
              </div>
            )}
          </div>
          
          <table className="w-full mb-4">
            <thead>
              <tr className="text-left text-sm border-b">
                <th className="pb-1">Item</th>
                <th className="pb-1 text-right">Qty</th>
                <th className="pb-1 text-right">Price</th>
                <th className="pb-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="py-1">{item.name}</td>
                  <td className="py-1 text-right">{item.quantity}</td>
                  <td className="py-1 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-1 text-right">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({settings.taxRate}%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Payment Method:</span>
              <span>{paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Amount Paid:</span>
              <span>${amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Change:</span>
              <span>${change.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Thank you for your purchase!</p>
            <p>Please keep this receipt for your records.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default POSTerminal;