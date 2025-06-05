import React from 'react';
import { BarChart2, DollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';
import { getLowStockProducts, getTopSellingProducts } from '../mock/data';
import { useEffect, useState } from 'react';
import axios from 'axios';
 

const Dashboard: React.FC = () => {
  const { products, transactions, salesData } = useAppContext();

  // Calculate metrics
  const todaySales = transactions
    .filter(t => {
      const today = new Date().toISOString().split('T')[0];
      return t.createdAt === today;
    })
    .reduce((sum, t) => sum + t.total, 0);
  
  const todayTransactions = transactions.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.createdAt === today;
  }).length;
  
  const topSellingProducts = getTopSellingProducts();

  const MetricCard = ({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) => (
    <Card className="h-full">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold text-gray-900">{value}</h3>
        </div>
      </div>
    </Card>
  );

  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/medicines/low-stock');
        setLowStockProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch low stock products:', error);
      }
    };

    fetchLowStockProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button size="sm">Refresh</Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today's Sales"
          value={`$${todaySales.toFixed(2)}`}
          icon={<DollarSign size={24} className="text-white" />}
          color="bg-primary-600"
        />
        <MetricCard
          title="Transactions"
          value={todayTransactions.toString()}
          icon={<ShoppingCart size={24} className="text-white" />}
          color="bg-secondary-500"
        />
        <MetricCard
          title="Total Products"
          value={products.length.toString()}
          icon={<Package size={24} className="text-white" />}
          color="bg-indigo-500"
        />
        <MetricCard
          title="Low Stock Alert"
          value={lowStockProducts.length.toString()}
          icon={<AlertTriangle size={24} className="text-white" />}
          color="bg-danger-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Sales Overview (Last 7 Days)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#0D6EFD" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Top Selling Products">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#20C997" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      <Card title="Low Stock Alerts">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <tr key={product._id}>
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
                          <div className="text-sm text-gray-500">{product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="xs">Restock</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No low stock products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
            
      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.customer ? transaction.customer.name : 'Walk-in Customer'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="outline" size="xs">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;