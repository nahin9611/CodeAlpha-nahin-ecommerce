import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchUsers = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get('http://localhost:5000/api/users', config);
          setUsers(data);
        } catch (err) {
          setError('Failed to fetch users.');
        }
      };
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="admin-list-container">
      <div className="admin-list-header">
        <h2>Registered Users</h2>
      </div>
      
      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN STATUS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id.substring(0, 10)}...</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`} style={{color: '#3b82f6'}}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (
                    <span style={{ color: '#10b981', fontWeight: 'bold' }}>Admin ✓</span>
                  ) : (
                    <span style={{ color: '#ef4444' }}>Customer ✗</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListScreen;