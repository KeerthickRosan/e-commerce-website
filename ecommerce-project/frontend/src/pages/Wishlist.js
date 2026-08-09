import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);

  useEffect(() => {
    api.get('/wishlist/').then(({ data }) => setWishlist(data));
  }, []);

  if (!wishlist) return <p className="text-center py-16 text-gray-500">Loading wishlist...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-5">My Wishlist</h1>
      {wishlist.products.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
