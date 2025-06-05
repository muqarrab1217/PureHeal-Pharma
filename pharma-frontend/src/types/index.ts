export interface Product {
  id: string;
  Name: string;
  sku: string;
  barcode: string;
  Category: string;
  price: number;
  Indication: string,
  Strength: string,
  cost: number;
  "Dosage Form": string,
  Classification: string,
  stock: number;
  minStock: number;
  image: string;
  supplier: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  customer: Customer | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  cashier: string;
  createdAt: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'in' | 'out' | 'adjustment';
  reason: string;
  supplier?: string;
  cost?: number;
  date: string;
}

export interface SalesMetric {
  name: string;
  value: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface TimeSeriesData {
  date: string;
  sales: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'cashier';
  avatar: string;
}

export interface AppSettings {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  taxRate: number;
  logo: string;
}