import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-navy text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 text-xl font-extrabold tracking-tight whitespace-nowrap">
          <img src="/images/navbar-logo.webp" alt="Ecommerce Logo" className="w-20 h-auto" />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 flex max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands and categories..."
            className="w-full px-3 py-2 rounded-l text-sm text-gray-900 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-accent-dark px-4 rounded-r font-semibold text-navy"
          >
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4 text-sm whitespace-nowrap">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-accent">Hi, {user.first_name || user.username}</Link>
              <Link to="/orders" className="hover:text-accent">Orders</Link>
              <Link to="/wishlist" className="hover:text-accent">Wishlist</Link>
              {isAdmin && <Link to="/admin" className="hover:text-accent">Admin</Link>}
              <button onClick={() => { logout(); navigate('/'); }} className="hover:text-accent">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-accent">Login</Link>
              <Link to="/register" className="hover:text-accent">Register</Link>
            </>
          )}
          <Link to="/cart" className="relative hover:text-accent font-semibold">
            Cart
            {cart?.total_items > 0 && (
              <span className="absolute -top-2 -right-3 bg-accent text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cart.total_items}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
