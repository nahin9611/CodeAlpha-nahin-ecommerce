import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Used to redirect the user
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext); // Pulls in our global function

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://codealpha-nahin-ecommerce.onrender.com/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart'); // Redirect to the cart page after adding
  };

  return (
    <div className="product-details-container">
      <Link to="/" className="btn-back">&larr; Back to Shop</Link>
      
      <div className="product-details-grid">
        <div className="product-image-large">
          <img src={product.imageUrl} alt={product.name} />
        </div>
        
        <div className="product-info-detailed">
          <h2>{product.name}</h2>
          <p className="price-tag">${product.price}</p>
          <p className="description">{product.description}</p>
          
          <div className="stock-status">
            Status: {product.countInStock > 0 ? (
              <span style={{ color: '#10b981' }}>In Stock ({product.countInStock} available)</span>
            ) : (
              <span style={{ color: '#ef4444' }}>Out of Stock</span>
            )}
          </div>
          
          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <span style={{ fontWeight: '600' }}>Quantity:</span>
              <select value={qty} onChange={(e) => setQty(e.target.value)} className="cart-select">
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}
          
          {product.countInStock > 0 && (
            <button className="btn-primary btn-block" onClick={addToCartHandler}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;