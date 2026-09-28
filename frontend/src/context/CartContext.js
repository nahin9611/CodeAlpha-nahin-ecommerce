import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Load the cart from Local Storage so items aren't lost on page refresh
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem('cartItems')) || []
  );

  // Automatically save to Local Storage whenever the cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id || x.product === product.product);
    
    if (existItem) {
      setCartItems(cartItems.map((x) =>
        (x.product === existItem.product) ? { ...x, qty: Number(qty) } : x
      ));
    } else {
      setCartItems([...cartItems, { 
        product: product._id, 
        name: product.name, 
        imageUrl: product.imageUrl, 
        price: product.price, 
        countInStock: product.countInStock,
        qty: Number(qty) 
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};