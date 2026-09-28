import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext'; // ADDITION 1

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </UserProvider>
);