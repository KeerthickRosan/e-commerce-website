import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(null);
      return;
    }
    try {
      const { data } = await api.get('/cart/');
      setCart(data);
    } catch {
      setCart(null);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/add/', { product: productId, quantity });
    setCart(data);
    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const { data } = await api.patch(`/cart/items/${itemId}/`, { quantity });
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await api.delete(`/cart/items/${itemId}/`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear/');
    setCart(data);
  };

  return (
    <CartContext.Provider
      value={{ cart, refreshCart, addToCart, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
