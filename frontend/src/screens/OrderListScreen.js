import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Security check: Only fetch if the user is an admin
    if (userInfo && userInfo.isAdmin) {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get('http://localhost:5000/api/orders', config);
          setOrders(data);
        } catch (err) {
          setError('Failed to fetch system orders.');
        }
      };
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>System Orders</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>ITEMS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}...</td>
                {/* Check if user exists (in case a user was deleted but their order remains) */}
                <td>{order.user ? order.user.name : 'Deleted User'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="order-total">${order.totalPrice.toFixed(2)}</td>
                <td>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListScreen;