import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import Orders from './pages/Orders';
import Register from './pages/Register';
import CustomerLogin from './pages/CustomerLogin';
import CustomerProducts from './pages/CustomerProducts';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import HomePage from './pages/HomePage';

const PrivateRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/customer/login" />;
  return children;
};

const CustomerRoute = ({ children }) => {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/customer/login" />;
  if (user?.role !== 'customer') return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />

            {/* Admin routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/products" element={
              <PrivateRoute><Products /></PrivateRoute>
            } />
            <Route path="/users" element={
              <PrivateRoute><Users /></PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute><Orders /></PrivateRoute>
            } />

            {/* Customer routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/customer/login" element={<CustomerLogin />} />
            <Route path="/customer/products" element={
              <CustomerRoute><CustomerProducts /></CustomerRoute>
            } />
            <Route path="/customer/cart" element={
              <CustomerRoute><Cart /></CustomerRoute>
            } />
            <Route path="/customer/my-orders" element={
              <CustomerRoute><MyOrders /></CustomerRoute>
            } />

            {/* Default */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;