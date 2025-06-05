import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  Tag, 
  Users, 
  Truck, 
  Receipt, 
  BarChart, 
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, settings, setCurrentUser } = useAppContext();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'POS Terminal', path: '/pos', icon: <ShoppingCart size={20} /> },
    { name: 'Products', path: '/products', icon: <Package size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Boxes size={20} /> },
    { name: 'Categories', path: '/categories', icon: <Tag size={20} /> },
    { name: 'Users', path: '/customers', icon: <Users size={20} /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Truck size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Reports', path: '/reports', icon: <BarChart size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: 'Low stock alert: Amoxicillin 500mg', time: '5 minutes ago' },
    { id: 2, message: 'New order received', time: '1 hour ago' },
    { id: 3, message: 'Payment received from Jane Doe', time: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <div className="text-primary-600 mr-2">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Medica</h1>
                <p className="text-xs text-gray-500">Pharmacy POS System</p>
              </div>
            </Link>
            <button 
              className="p-1 text-gray-500 rounded-md lg:hidden hover:text-primary-500 hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-2 py-4 overflow-y-auto">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full"
                src="/images/profile.png"
                alt={currentUser?.username}
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{currentUser?.username}</p>
                <p className="text-xs font-medium text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`lg:pl-64 flex flex-col min-h-screen`}>
        {/* Top navbar */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 text-gray-500 rounded-md lg:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Open menu</span>
              <Menu size={24} />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full py-2 pl-10 pr-3 text-sm bg-gray-100 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex items-center ml-4 space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                
                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div 
                    className="absolute right-0 z-10 w-80 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                    onBlur={() => setNotificationsOpen(false)}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
                        Notifications
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map(notification => (
                          <div 
                            key={notification.id}
                            className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                          >
                            <p className="text-sm text-gray-700">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 text-xs font-medium text-center text-primary-600 hover:text-primary-700">
                        View all notifications
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/images/profile.png"
                    alt="profile image"
                  />
                  <ChevronDown size={16} className="ml-1 text-gray-500" />
                </button>
                
                {profileOpen && (
                  <div 
                    className="absolute right-0 z-10 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                    onBlur={() => setProfileOpen(false)}
                  >
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setCurrentUser(null);
                          localStorage.removeItem("user");
                        }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;