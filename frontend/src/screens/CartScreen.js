import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const getCartCount = () => cartItems.reduce((qty, item) => Number(item.qty) + qty, 0);
  const getCartSubTotal = () => cartItems.reduce((price, item) => price + item.price * item.qty, 0);

  return (
    <div className="cart-screen">
      <div className="cart-items-container">
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            Your cart is empty. <Link to="/">Go Back to Shop</Link>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.product}>
              <img src={item.imageUrl} alt={item.name} />
              <Link to={`/product/${item.product}`} className="cart-item-name">{item.name}</Link>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
              
              <select 
                value={item.qty} 
                onChange={(e) => addToCart(item, e.target.value)}
                className="cart-select"
              >
                {[...Array(item.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              
              <button className="btn-delete" onClick={() => removeFromCart(item.product)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-info">
          <p>Subtotal ({getCartCount()} items)</p>
          <p className="summary-price">${getCartSubTotal().toFixed(2)}</p>
        </div>
<button 
          className="btn-primary btn-block" 
          onClick={() => window.location.href = '/checkout'}
        >
          Proceed To Checkout
        </button>      </div>
    </div>
  );
};

export default CartScreen;