import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AdminDashboard = () => {
  const { userInfo } = useContext(UserContext);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Command Center</h2>
        <p>Welcome back, Administrator {userInfo.name}</p>
      </div>

      <div className="admin-grid">
        <Link to="/admin/products" className="admin-card">
          <h3>Manage Products</h3>
          <p>Add new gear, update prices, or change stock levels.</p>
        </Link>
        
        <Link to="/admin/orders" className="admin-card">
          <h3>Manage Orders</h3>
          <p>View all customer orders and update delivery statuses.</p>
        </Link>
        
        <Link to="/admin/users" className="admin-card">
          <h3>Manage Users</h3>
          <p>View registered customers or grant admin privileges.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;