import React from 'react';
import { Link } from 'react-router-dom';

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

function getProductImage(product) {
  if (product.image) return product.image;
  if (product.slug && staticProductImages[product.slug]) return staticProductImages[product.slug];
  return '/images/product-placeholder.svg';
}

export default function ProductCard({ product }) {
  const hasDiscount = product.discount_price && Number(product.discount_price) < Number(product.price);
  return (
    <Link
      to={`/products/${product.slug}`}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4 flex flex-col"
    >
      <div className="h-40 flex items-center justify-center bg-gray-50 rounded mb-3 overflow-hidden">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full object-contain"
          onError={(e) => { e.currentTarget.src = '/images/product-placeholder.svg'; }}
        />
      </div>
      <p className="text-xs text-gray-500 mb-1">{product.category_name}</p>
      <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{product.name}</h3>
      <div className="mt-auto flex items-center gap-2">
        <span className="text-lg font-bold text-navy">₹{Number(product.final_price).toLocaleString('en-IN')}</span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>
        )}
      </div>
      {!product.in_stock && <span className="text-xs text-red-500 mt-1">Out of stock</span>}
    </Link>
  );
}
