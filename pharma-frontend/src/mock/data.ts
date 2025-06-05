import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import type {
  Product,
  Category,
  Customer,
  Supplier,
  Transaction,
  StockEntry,
  TimeSeriesData,
  User,
  AppSettings,
} from '../types';

// Helper function to generate dates
const generateDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return format(date, 'yyyy-MM-dd');
};

// Categories
export const categories: Category[] = [
  {
    id: '1',
    name: 'Antibiotics',
    description: 'Medications used to treat bacterial infections',
    createdAt: generateDate(120),
    updatedAt: generateDate(30),
  },
  {
    id: '2',
    name: 'Pain Relief',
    description: 'Medications used to alleviate pain',
    createdAt: generateDate(110),
    updatedAt: generateDate(25),
  },
  {
    id: '3',
    name: 'Vitamins',
    description: 'Nutritional supplements',
    createdAt: generateDate(100),
    updatedAt: generateDate(20),
  },
  {
    id: '4',
    name: 'Cold & Flu',
    description: 'Medications used to treat cold and flu symptoms',
    createdAt: generateDate(90),
    updatedAt: generateDate(15),
  },
  {
    id: '5',
    name: 'First Aid',
    description: 'Products for wound care and first aid',
    createdAt: generateDate(80),
    updatedAt: generateDate(10),
  },
];

// Suppliers
export const suppliers: Supplier[] = [
  {
    id: '1',
    companyName: 'PharmaMed Supplies',
    contactName: 'John Smith',
    email: 'john@pharmamed.com',
    phone: '555-123-4567',
    address: '123 Medical Blvd, Health City, HC 12345',
    createdAt: generateDate(200),
    updatedAt: generateDate(45),
  },
  {
    id: '2',
    companyName: 'MediSource Inc.',
    contactName: 'Sarah Johnson',
    email: 'sarah@medisource.com',
    phone: '555-234-5678',
    address: '456 Pharma St, Medicine Town, MT 23456',
    createdAt: generateDate(180),
    updatedAt: generateDate(40),
  },
  {
    id: '3',
    companyName: 'GlobalRx Distributors',
    contactName: 'Michael Chen',
    email: 'michael@globalrx.com',
    phone: '555-345-6789',
    address: '789 Distribution Ave, Supply City, SC 34567',
    createdAt: generateDate(160),
    updatedAt: generateDate(35),
  },
];

// Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    sku: 'AMX500',
    barcode: '5901234123457',
    description: 'Antibiotic used to treat bacterial infections',
    category: '1',
    price: 12.99,
    cost: 5.50,
    stock: 150,
    minStock: 30,
    image: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '1',
    expiryDate: generateDate(-365),
    createdAt: generateDate(150),
    updatedAt: generateDate(30),
  },
  {
    id: '2',
    name: 'Ibuprofen 200mg',
    sku: 'IBU200',
    barcode: '5901234123458',
    description: 'Nonsteroidal anti-inflammatory drug used for pain relief',
    category: '2',
    price: 8.99,
    cost: 3.25,
    stock: 200,
    minStock: 50,
    image: 'https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '2',
    expiryDate: generateDate(-300),
    createdAt: generateDate(145),
    updatedAt: generateDate(29),
  },
  {
    id: '3',
    name: 'Vitamin C 1000mg',
    sku: 'VITC1000',
    barcode: '5901234123459',
    description: 'Dietary supplement to support immune function',
    category: '3',
    price: 15.99,
    cost: 7.25,
    stock: 120,
    minStock: 30,
    image: 'https://images.pexels.com/photos/6941875/pexels-photo-6941875.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '3',
    expiryDate: generateDate(-400),
    createdAt: generateDate(140),
    updatedAt: generateDate(28),
  },
  {
    id: '4',
    name: 'Cold & Flu Relief',
    sku: 'COLD01',
    barcode: '5901234123460',
    description: 'Multi-symptom cold and flu relief tablets',
    category: '4',
    price: 10.99,
    cost: 4.50,
    stock: 85,
    minStock: 25,
    image: 'https://images.pexels.com/photos/139398/himalayas-blue-black-white-139398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '1',
    expiryDate: generateDate(-250),
    createdAt: generateDate(135),
    updatedAt: generateDate(27),
  },
  {
    id: '5',
    name: 'Bandage Pack',
    sku: 'BAND01',
    barcode: '5901234123461',
    description: 'Assorted adhesive bandages for minor wounds',
    category: '5',
    price: 6.99,
    cost: 2.75,
    stock: 75,
    minStock: 20,
    image: 'https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '2',
    expiryDate: generateDate(-500),
    createdAt: generateDate(130),
    updatedAt: generateDate(26),
  },
  {
    id: '6',
    name: 'Paracetamol 500mg',
    sku: 'PARA500',
    barcode: '5901234123462',
    description: 'Pain reliever and fever reducer',
    category: '2',
    price: 7.99,
    cost: 3.00,
    stock: 15,
    minStock: 30,
    image: 'https://images.pexels.com/photos/6812567/pexels-photo-6812567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '3',
    expiryDate: generateDate(-320),
    createdAt: generateDate(125),
    updatedAt: generateDate(25),
  },
  {
    id: '7',
    name: 'Multivitamin Daily',
    sku: 'MVIT01',
    barcode: '5901234123463',
    description: 'Complete multivitamin supplement',
    category: '3',
    price: 18.99,
    cost: 8.50,
    stock: 90,
    minStock: 20,
    image: 'https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    supplier: '1',
    expiryDate: generateDate(-400),
    createdAt: generateDate(120),
    updatedAt: generateDate(24),
  },
];

// Customers
export const customers: Customer[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-111-2222',
    address: '123 Main St, Anytown, AT 12345',
    createdAt: generateDate(100),
    updatedAt: generateDate(10),
  },
  {
    id: '2',
    name: 'John Public',
    email: 'john@example.com',
    phone: '555-222-3333',
    address: '456 Oak St, Somewhere, SW 23456',
    createdAt: generateDate(90),
    updatedAt: generateDate(9),
  },
  {
    id: '3',
    name: 'Mary Smith',
    email: 'mary@example.com',
    phone: '555-333-4444',
    address: '789 Pine St, Nowhere, NW 34567',
    createdAt: generateDate(80),
    updatedAt: generateDate(8),
  },
];

// Transactions
export const transactions: Transaction[] = [
  {
    id: '1',
    items: [
      {
        ...products[0],
        quantity: 2,
        subtotal: products[0].price * 2,
      },
      {
        ...products[1],
        quantity: 1,
        subtotal: products[1].price,
      },
    ],
    customer: customers[0],
    subtotal: products[0].price * 2 + products[1].price,
    tax: (products[0].price * 2 + products[1].price) * 0.1,
    discount: 0,
    total: (products[0].price * 2 + products[1].price) * 1.1,
    paymentMethod: 'Cash',
    paymentStatus: 'paid',
    cashier: 'Admin User',
    createdAt: generateDate(5),
  },
  {
    id: '2',
    items: [
      {
        ...products[2],
        quantity: 1,
        subtotal: products[2].price,
      },
    ],
    customer: customers[1],
    subtotal: products[2].price,
    tax: products[2].price * 0.1,
    discount: 0,
    total: products[2].price * 1.1,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    cashier: 'Admin User',
    createdAt: generateDate(4),
  },
  {
    id: '3',
    items: [
      {
        ...products[3],
        quantity: 3,
        subtotal: products[3].price * 3,
      },
      {
        ...products[4],
        quantity: 2,
        subtotal: products[4].price * 2,
      },
    ],
    customer: customers[2],
    subtotal: products[3].price * 3 + products[4].price * 2,
    tax: (products[3].price * 3 + products[4].price * 2) * 0.1,
    discount: 5,
    total: (products[3].price * 3 + products[4].price * 2) * 1.1 - 5,
    paymentMethod: 'Cash',
    paymentStatus: 'paid',
    cashier: 'Admin User',
    createdAt: generateDate(3),
  },
  {
    id: '4',
    items: [
      {
        ...products[5],
        quantity: 1,
        subtotal: products[5].price,
      },
    ],
    customer: null,
    subtotal: products[5].price,
    tax: products[5].price * 0.1,
    discount: 0,
    total: products[5].price * 1.1,
    paymentMethod: 'Card',
    paymentStatus: 'paid',
    cashier: 'Admin User',
    createdAt: generateDate(2),
  },
  {
    id: '5',
    items: [
      {
        ...products[0],
        quantity: 1,
        subtotal: products[0].price,
      },
      {
        ...products[6],
        quantity: 1,
        subtotal: products[6].price,
      },
    ],
    customer: customers[0],
    subtotal: products[0].price + products[6].price,
    tax: (products[0].price + products[6].price) * 0.1,
    discount: 2,
    total: (products[0].price + products[6].price) * 1.1 - 2,
    paymentMethod: 'Cash',
    paymentStatus: 'paid',
    cashier: 'Admin User',
    createdAt: generateDate(1),
  },
];

// Stock Entries
export const stockEntries: StockEntry[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Amoxicillin 500mg',
    quantity: 50,
    type: 'in',
    reason: 'Initial stock',
    supplier: 'PharmaMed Supplies',
    cost: 275,
    date: generateDate(60),
  },
  {
    id: '2',
    productId: '2',
    productName: 'Ibuprofen 200mg',
    quantity: 100,
    type: 'in',
    reason: 'Restock',
    supplier: 'MediSource Inc.',
    cost: 325,
    date: generateDate(55),
  },
  {
    id: '3',
    productId: '1',
    productName: 'Amoxicillin 500mg',
    quantity: 5,
    type: 'out',
    reason: 'Expired',
    date: generateDate(40),
  },
  {
    id: '4',
    productId: '3',
    productName: 'Vitamin C 1000mg',
    quantity: 30,
    type: 'in',
    reason: 'Restock',
    supplier: 'GlobalRx Distributors',
    cost: 217.5,
    date: generateDate(30),
  },
  {
    id: '5',
    productId: '4',
    productName: 'Cold & Flu Relief',
    quantity: 15,
    type: 'out',
    reason: 'Damaged',
    date: generateDate(20),
  },
];

// Sales Data for Charts
export const salesData: TimeSeriesData[] = [
  { date: generateDate(6), sales: 350 },
  { date: generateDate(5), sales: 420 },
  { date: generateDate(4), sales: 380 },
  { date: generateDate(3), sales: 450 },
  { date: generateDate(2), sales: 520 },
  { date: generateDate(1), sales: 480 },
  { date: generateDate(0), sales: 400 },
];

// Users
export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@pharmapos.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: '2',
    name: 'Cashier User',
    email: 'cashier@pharmapos.com',
    role: 'cashier',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

// App Settings
export const appSettings: AppSettings = {
  storeName: 'PharmaCare Pharmacy',
  address: '123 Health Street, Medical District, MD 12345',
  phone: '555-PHARMACY',
  email: 'info@pharmacare.com',
  currency: 'USD',
  taxRate: 10,
  logo: 'https://example.com/logo.png',
};

// Helper function to generate a new ID
export const generateId = (): string => {
  return uuidv4();
};

// Calculate today's sales
export const calculateTodaySales = (): number => {
  const today = generateDate(0);
  return transactions
    .filter(transaction => transaction.createdAt === today)
    .reduce((sum, transaction) => sum + transaction.total, 0);
};

// Get low stock products
export const getLowStockProducts = (): Product[] => {
  return products.filter(product => product.stock <= product.minStock);
};

// Get top selling products
export const getTopSellingProducts = (): { id: string; name: string; total: number; quantity: number }[] => {
  const productSales: Record<string, { name: string; total: number; quantity: number }> = {};
  
  transactions.forEach(transaction => {
    transaction.items.forEach(item => {
      if (!productSales[item.id]) {
        productSales[item.id] = { name: item.name, total: 0, quantity: 0 };
      }
      productSales[item.id].total += item.subtotal;
      productSales[item.id].quantity += item.quantity;
    });
  });
  
  return Object.entries(productSales)
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
};