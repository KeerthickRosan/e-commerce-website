import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_address_line1: '', shipping_address_line2: '', shipping_city: '',
    shipping_state: '', shipping_postal_code: '', shipping_country: 'India',
    phone: '', payment_method: 'cod',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data: order } = await api.post('/orders/checkout/', form);

      if (form.payment_method === 'razorpay') {
        const { data: rzp } = await api.post('/payments/razorpay/create-order/', { order_id: order.id });
        // In a real app, load the Razorpay checkout.js script and open the widget here using rzp.razorpay_key_id.
        console.log('Razorpay order created:', rzp);
      }

      await refreshCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return <p className="text-center py-16 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 bg-white border rounded-lg p-6 space-y-3">
        <h1 className="text-xl font-bold text-navy mb-2">Shipping Details</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input required placeholder="Address line 1" value={form.shipping_address_line1}
          onChange={(e) => setForm({ ...form, shipping_address_line1: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm" />
        <input placeholder="Address line 2 (optional)" value={form.shipping_address_line2}
          onChange={(e) => setForm({ ...form, shipping_address_line2: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input required placeholder="City" value={form.shipping_city}
            onChange={(e) => setForm({ ...form, shipping_city: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input required placeholder="State" value={form.shipping_state}
            onChange={(e) => setForm({ ...form, shipping_state: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input required placeholder="Postal code" value={form.shipping_postal_code}
            onChange={(e) => setForm({ ...form, shipping_postal_code: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input required placeholder="Country" value={form.shipping_country}
            onChange={(e) => setForm({ ...form, shipping_country: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
        </div>
        <input placeholder="Phone" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm" />

        <div>
          <label className="text-sm font-medium block mb-1">Payment method</label>
          <select
            value={form.payment_method}
            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="razorpay">Pay Online (Razorpay)</option>
          </select>
        </div>

        <button disabled={submitting} type="submit"
          className="w-full bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded disabled:opacity-50">
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>

      <div className="bg-white border rounded-lg p-5 h-fit">
        <h2 className="font-semibold text-navy mb-3">Order Summary</h2>
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-1">
            <span>{item.product_detail.name} x{item.quantity}</span>
            <span>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{Number(cart.total_price).toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
