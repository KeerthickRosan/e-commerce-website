import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const staticProductImages = {
  'wireless-bluetooth-headphones': '/images/wireless-bluetooth-headphones.jpg',
  'smartphone-128gb': '/images/smartphone-128gb.avif',
  'laptop-backpack': '/images/laptop-backpack.jpg',
  'men-running-shoes': '/images/men-running-shoes.jpg',
  'non-stick-cookware-set': '/images/non-stick-cookware-set.webp',
  'study-desk-lamp': '/images/study-desk-lamp.jpg',
  'atomic-habits': '/images/atomic-habits.png',
  'the-pragmatic-programmer': '/images/pragmatic-programmer.jpg',
};

function getDetailImage(product) {
  if (product.image) return product.image;
  if (product.slug && staticProductImages[product.slug]) return staticProductImages[product.slug];
  return '/images/product-placeholder.svg';
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const load = () => {
    api.get(`/products/${slug}/`).then(({ data }) => setProduct(data)).catch(() => setProduct(null));
  };

  useEffect(() => { load(); }, [slug]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Could not add to cart.');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) return navigate('/login');
    await api.post('/wishlist/toggle/', { product: product.id });
    setMessage('Wishlist updated!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    await api.post('/products/reviews/', { product: product.id, rating, comment: reviewText });
    setReviewText('');
    load();
  };

  if (!product) return <p className="text-center py-16 text-gray-500">Loading product...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
      <div className="bg-white border rounded-lg h-96 flex items-center justify-center overflow-hidden">
        <img
          src={getDetailImage(product)}
          alt={product.name}
          className="max-h-full object-contain"
          onError={(e) => { e.currentTarget.src = '/images/product-placeholder.svg'; }}
        />
      </div>

      <div>
        <p className="text-sm text-gray-500">{product.category_name} {product.brand && `· ${product.brand}`}</p>
        <h1 className="text-2xl font-bold text-navy mt-1">{product.name}</h1>
        <p className="text-sm text-yellow-600 mt-1">★ {Number(product.average_rating).toFixed(1)} ({product.reviews.length} reviews)</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-navy">₹{Number(product.final_price).toLocaleString('en-IN')}</span>
          {product.discount_price && (
            <span className="text-gray-400 line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
          )}
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

        <p className={`mt-3 text-sm font-medium ${product.in_stock ? 'text-green-600' : 'text-red-500'}`}>
          {product.in_stock ? `In stock (${product.stock} available)` : 'Out of stock'}
        </p>

        <div className="flex items-center gap-3 mt-5">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-16 border rounded px-2 py-2 text-center"
          />
          <button
            disabled={!product.in_stock}
            onClick={handleAddToCart}
            className="bg-accent hover:bg-accent-dark text-navy font-semibold px-6 py-2 rounded disabled:opacity-40"
          >
            Add to Cart
          </button>
          <button
            onClick={handleToggleWishlist}
            className="border border-navy text-navy px-4 py-2 rounded hover:bg-navy hover:text-white"
          >
            ♡ Wishlist
          </button>
        </div>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

        <hr className="my-8" />

        <h3 className="font-semibold text-navy mb-3">Customer Reviews</h3>
        <div className="space-y-3 mb-6">
          {product.reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
          {product.reviews.map((r) => (
            <div key={r.id} className="border-b pb-2">
              <p className="text-sm font-medium">{r.username} · ★ {r.rating}</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} className="space-y-2">
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
          </select>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a review..."
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
          />
          <button type="submit" className="bg-navy text-white px-4 py-1.5 rounded text-sm hover:bg-navy-light">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
