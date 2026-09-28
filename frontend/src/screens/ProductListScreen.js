import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const createProductHandler = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // Creates a dummy product in the backend
      const { data } = await axios.post('http://localhost:5000/api/products', {}, config);
      // Immediately redirect to the edit screen for that new product
      navigate(`/admin/product/${data._id}/edit`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating product');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        // Refresh the list after deletion
        fetchProducts(); 
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>Product Inventory</h2>
        <button className="btn-primary" onClick={createProductHandler}>
          + Create Product
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.countInStock}</td>
                <td>
                  {/* Link to the new Edit screen we are about to build */}
                  <Link to={`/admin/product/${product._id}/edit`}>
                    <button className="btn-edit" style={{ marginRight: '10px' }}>Edit</button>
                  </Link>
                  <button className="btn-delete" onClick={() => deleteHandler(product._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListScreen;