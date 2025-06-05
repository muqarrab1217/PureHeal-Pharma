import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  products as initialProducts,
  categories as initialCategories,
  customers as initialCustomers,
  suppliers as initialSuppliers,
  transactions as initialTransactions,
  stockEntries as initialStockEntries,
  users as initialUsers,
  appSettings as initialAppSettings,
} from '../mock/data';
import type {
  Product,
  Category,
  Customer,
  Supplier,
  Transaction,
  StockEntry,
  CartItem,
  User,
  AppSettings,
} from '../types';

interface AppContextType {
  // Data
  products: Product[];
  categories: Category[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  stockEntries: StockEntry[];
  users: User[];
  settings: AppSettings;
  currentUser: User | null;
  
  // Cart State
  cart: CartItem[];
  
  // CRUD Operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Cart Operations
  addToCart: (product: Product, quantity: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Transaction Operations
  createTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  
  // Stock Operations
  addStockEntry: (entry: Omit<StockEntry, 'id' | 'date'>) => void;
  
  // User Operations
  setCurrentUser: (user: User | null) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(initialStockEntries);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [settings, setSettings] = useState<AppSettings>(initialAppSettings);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });


  // Helper function to generate current date
  const getCurrentDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper function to generate ID
  const generateId = (): string => {
    return Math.random().toString(36).substring(2, 11);
  };

  // Product CRUD
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: generateId(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, ...product, updatedAt: getCurrentDate() }
          : p
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Category CRUD
  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(
      categories.map((c) =>
        c.id === id
          ? { ...c, ...category, updatedAt: getCurrentDate() }
          : c
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  // Customer CRUD
  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: generateId(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers(
      customers.map((c) =>
        c.id === id
          ? { ...c, ...customer, updatedAt: getCurrentDate() }
          : c
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  // Supplier CRUD
  const addSupplier = (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: generateId(),
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate(),
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(
      suppliers.map((s) =>
        s.id === id
          ? { ...s, ...supplier, updatedAt: getCurrentDate() }
          : s
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number) => {
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * item.price,
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        ...product,
        quantity,
        subtotal: quantity * product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id
            ? { ...item, quantity, subtotal: quantity * item.price }
            : item
        )
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Transaction Operations
  const createTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: getCurrentDate(),
    };
    setTransactions([...transactions, newTransaction]);
    
    // Update stock levels
    transaction.items.forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        updateProduct(product.id, { stock: product.stock - item.quantity });
        
        // Add stock entry for the transaction
        addStockEntry({
          productId: product.id,
          productName: product.name,
          quantity: item.quantity,
          type: 'out',
          reason: `Sale - Transaction ID: ${newTransaction.id}`,
        });
      }
    });
    
    // Clear the cart
    clearCart();
  };

  // Stock Operations
  const addStockEntry = (entry: Omit<StockEntry, 'id' | 'date'>) => {
    const newEntry: StockEntry = {
      ...entry,
      id: generateId(),
      date: getCurrentDate(),
    };
    setStockEntries([...stockEntries, newEntry]);
    
    // Update product stock if it's a stock adjustment
    if (entry.type === 'in') {
      const product = products.find((p) => p.id === entry.productId);
      if (product) {
        updateProduct(product.id, { stock: product.stock + entry.quantity });
      }
    }
  };

  // Settings Operations
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  // Context Value
  const value: AppContextType = {
    products,
    categories,
    customers,
    suppliers,
    transactions,
    stockEntries,
    users,
    settings,
    currentUser,
    cart,
    
    addProduct,
    updateProduct,
    deleteProduct,
    
    addCategory,
    updateCategory,
    deleteCategory,
    
    addCustomer,
    updateCustomer,
    deleteCustomer,
    
    addSupplier,
    updateSupplier,
    deleteSupplier,
    
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    
    createTransaction,
    
    addStockEntry,
    
    setCurrentUser,
    updateSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};