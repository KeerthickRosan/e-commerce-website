import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-navy mb-2">Your cart is empty</h2>
        <Link to="/" className="text-blue-600 hover:underline">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-xl font-bold text-navy">Shopping Cart</h1>
        {cart.items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white border rounded-lg p-4">
            <div className="w-20 h-20 bg-gray-50 flex items-center justify-center rounded shrink-0">
              {item.product_detail.image ? (
                <img src={item.product_detail.image} alt="" className="max-h-full object-contain" />
              ) : <span className="text-xs text-gray-300">No image</span>}
            </div>
            <div className="flex-1">
              <Link to={`/products/${item.product_detail.slug}`} className="font-medium text-navy hover:underline">
                {item.product_detail.name}
              </Link>
              <p className="text-sm text-gray-500">₹{Number(item.product_detail.final_price).toLocaleString('en-IN')} each</p>
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="number" min={1} value={item.quantity}
                  onChange={(e) => updateItem(item.id, Math.max(1, Number(e.target.value)))}
                  className="w-16 border rounded px-2 py-1 text-sm"
                />
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm hover:underline">
                  Remove
                </button>
              </div>
            </div>
            <div className="font-semibold text-navy">₹{Number(item.subtotal).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-5 h-fit">
        <h2 className="font-semibold text-navy mb-3">Order Summary</h2>
        <div className="flex justify-between text-sm mb-1">
          <span>Items ({cart.total_items})</span>
          <span>₹{Number(cart.total_price).toLocaleString('en-IN')}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">Shipping & taxes calculated at checkout.</p>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
