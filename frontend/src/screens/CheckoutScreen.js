import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const CheckoutScreen = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Security Guard: Redirect if not logged in or if cart is empty
// Security Guard: Redirect if not logged in or if cart is empty
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (cartItems.length === 0) {
      navigate('/');
    }
  }, [userInfo, cartItems, navigate]);

  const getCartSubTotal = () => cartItems.reduce((price, item) => price + item.price * item.qty, 0);

  const placeOrderHandler = async () => {
    try {
      // Pass the secure JWT token to the backend
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems,
          totalPrice: getCartSubTotal(),
        },
        config
      );

      setSuccess(true);
      
      // Clear the local cart after a successful order
      localStorage.removeItem('cartItems');
      
      // Hard refresh back to the home page after 3 seconds
      setTimeout(() => {
        window.location.href = '/'; 
      }, 3000);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Error processing order');
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#10b981' }}>Order Successful!</h2>
          <p>Thank you for shopping with Nahin Ecommerce.</p>
          <p style={{ marginTop: '15px', color: '#6b7280' }}>Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-summary">
        <h2>Review Your Order</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div key={item.product} className="checkout-item">
              <img src={item.imageUrl} alt={item.name} />
              <div className="checkout-item-details">
                <h4>{item.name}</h4>
                <p>Qty: {item.qty} x ${item.price.toFixed(2)}</p>
              </div>
              <p className="checkout-item-total">${(item.qty * item.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-summary">
        <h3>Order Total</h3>
        <div className="cart-summary-info">
          <p>Subtotal</p>
          <p className="summary-price">${getCartSubTotal().toFixed(2)}</p>
        </div>
        <button className="btn-primary btn-block" onClick={placeOrderHandler}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutScreen;