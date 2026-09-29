import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminDashboard from './screens/AdminDashboard'; // ADDITION 1
import SearchBox from './components/SearchBox';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen'; 
import { ProtectedRoute, PublicRoute, AdminRoute } from './components/RouteGuards'; // ADDITION 2
import { CartContext } from './context/CartContext';
import { UserContext } from './context/UserContext';
import './App.css'; 

function App() {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(UserContext);
  
  const getCartCount = () => cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);

  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="nav-brand">
            <Link to="/">Nahin Ecommerce</Link>
          </div>
          
          <SearchBox />

          <nav className="nav-links">
            <Link to="/cart">
              Cart <span className="cart-badge">{getCartCount()}</span>
            </Link>
            
            {userInfo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Show Admin link only if user is an admin */}
                {userInfo.isAdmin && (
                  <Link to="/admin" className="admin-nav-link">Admin Panel</Link>
                )}
                <Link to="/profile" className="profile-link">Hi, {userInfo.name}</Link>
                <button onClick={logout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="login-link">Sign In</Link>
            )}
          </nav>
        </header>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterScreen /></PublicRoute>} />
            
            <Route path="/checkout" element={<ProtectedRoute><CheckoutScreen /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductListScreen /></AdminRoute>} />
            <Route path="/admin/product/:id/edit" element={<AdminRoute><ProductEditScreen /></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><OrderListScreen /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserListScreen /></AdminRoute>} />
            
            {/* Secure Admin Route */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Nahin Ecommerce. Built for CodeAlpha.</p>
        </footer>
      </div>
    </Router>
  );
}



export default App;

