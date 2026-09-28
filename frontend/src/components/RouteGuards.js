import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  return userInfo ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  return !userInfo ? children : <Navigate to="/" replace />;
};

// NEW: Prevents non-admins from accessing the dashboard
export const AdminRoute = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/" replace />;
};