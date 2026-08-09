import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}/`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <p className="text-center py-16 text-gray-500">Loading order...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-1">Order {order.order_number}</h1>
      <p className="text-sm text-gray-500 mb-6">Placed on {new Date(order.created_at).toLocaleString()}</p>

      <div className="bg-white border rounded-lg p-5 mb-5">
        <h2 className="font-semibold text-navy mb-3">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span>{item.product_name} x{item.quantity}</span>
            <span>₹{Number(item.subtotal).toLocaleString('en-IN')}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm mt-3">
          <span>Subtotal</span><span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span><span>₹{Number(order.shipping_fee).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between font-semibold mt-1">
          <span>Total</span><span>₹{Number(order.total).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-5">
        <h2 className="font-semibold text-navy mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-700">
          {order.shipping_address_line1}, {order.shipping_address_line2 && `${order.shipping_address_line2}, `}
          {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}, {order.shipping_country}
        </p>
        <p className="text-sm text-gray-700 mt-2">Payment: {order.payment_method.toUpperCase()}</p>
        <p className="text-sm text-gray-700">Status: <span className="font-medium capitalize">{order.status}</span></p>
      </div>
    </div>
  );
}
