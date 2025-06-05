import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import POSTerminal from './pages/POSTerminal';
import Products from './pages/Products';
import SignIn from './pages/SignIn';
import Customers from './pages/Users';
import Categories from './pages/Categories';

// Placeholder components for routes
const Inventory = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
    <p>Inventory management page content will go here.</p>
  </div>
);

const Suppliers = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Suppliers</h1>
    <p>Suppliers management page content will go here.</p>
  </div>
);

const Transactions = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Transactions</h1>
    <p>Transactions history page content will go here.</p>
  </div>
);

const Reports = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Reports</h1>
    <p>Reports page content will go here.</p>
  </div>
);

const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <p>Settings page content will go here.</p>
  </div>
);

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser } = useAppContext();
  // You can also add checks like currentUser?.id or roles, etc.
  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <Layout>
              <POSTerminal />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <Layout>
              <Inventory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Layout>
              <Categories />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <Layout>
              <Customers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <Layout>
              <Suppliers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
