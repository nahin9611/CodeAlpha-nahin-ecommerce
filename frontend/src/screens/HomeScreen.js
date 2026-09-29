import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const { keyword } = useParams(); // Grabs the keyword from the URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // If a keyword exists, append it to the API URL
        const url = keyword 
          ? `https://codealpha-nahin-ecommerce.onrender.com/api/products?keyword=${keyword}`
          : 'https://codealpha-nahin-ecommerce.onrender.com/api/products';
          
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, [keyword]); // Re-run effect whenever the keyword changes

  return (
    <div className="home-screen">
      <h2 className="section-title">
        {keyword ? `Search Results for "${keyword}"` : 'Latest Arrivals'}
      </h2>
      
      {keyword && (
        <Link to="/" className="btn-back" style={{ marginBottom: '20px', display: 'inline-block' }}>
          &larr; Go Back
        </Link>
      )}

      {products.length === 0 ? (
        <h3 style={{ textAlign: 'center', marginTop: '50px' }}>No products found matching your search.</h3>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/product/${product._id}`}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
              </Link>
              <div className="product-info">
                <Link to={`/product/${product._id}`} className="product-name">
                  <h3>{product.name}</h3>
                </Link>
                <p className="product-price">${product.price.toFixed(2)}</p>
                
                <Link to={`/product/${product._id}`} style={{ width: '100%' }}>
                  <button className="btn-primary" style={{ width: '100%' }}>View Details</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeScreen;