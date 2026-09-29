import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const ProfileScreen = () => {
  const { userInfo } = useContext(UserContext);
  const [userProfile, setUserProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Fetch user details and their specific orders simultaneously
        const { data: profileData } = await axios.get('https://codealpha-nahin-ecommerce.onrender.com/api/users/profile', config);
        const { data: orderData } = await axios.get('https://codealpha-nahin-ecommerce.onrender.com/api/orders/myorders', config);

        setUserProfile(profileData);
        setOrders(orderData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
      }
    };

    if (userInfo) {
      fetchProfileAndOrders();
    }
  }, [userInfo]);

  return (
    <div className="profile-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="profile-layout">
        {/* Left Column: User Info */}
        <div className="profile-info-card">
          <h2>My Profile</h2>
          {userProfile && (
            <div className="user-details">
              <p><strong>Name:</strong> {userProfile.name}</p>
              <p><strong>Email:</strong> {userProfile.email}</p>
              <p><strong>Account Type:</strong> {userProfile.isAdmin ? 'Admin' : 'Standard Customer'}</p>
            </div>
          )}
        </div>

        {/* Right Column: Order History */}
        <div className="profile-orders-card">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p className="empty-orders">You haven't placed any orders yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>ITEMS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 10)}...</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="order-total">${order.totalPrice.toFixed(2)}</td>
                      <td>{order.orderItems.reduce((acc, item) => acc + item.qty, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;