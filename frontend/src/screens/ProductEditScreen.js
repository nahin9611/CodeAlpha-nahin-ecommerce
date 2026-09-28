import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImageUrl(data.imageUrl);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (err) {
        setError('Failed to fetch product details.');
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/products/${productId}`,
        { name, price, imageUrl, category, countInStock, description },
        config
      );
      
      // Navigate back to the product list upon success
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating product');
    }
  };

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', marginTop: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <Link to="/admin/products" className="btn-back" style={{ display: 'inline-block', marginBottom: '20px' }}>
          &larr; Go Back
        </Link>
        
        <h2>Edit Product</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label>Price ($)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Stock Count</label>
              <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows="4"
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              required 
            />
          </div>
          <button type="submit" className="btn-primary btn-block">Update Product</button>
        </form>
      </div>
    </div>
  );
};

export default ProductEditScreen;