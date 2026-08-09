import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/').then(({ data }) => setOrders(data.results || data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-16 text-gray-500">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-5">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to={`/orders/${o.id}`}
              className="flex justify-between items-center bg-white border rounded-lg p-4 hover:shadow">
              <div>
                <p className="font-medium text-navy">{o.order_number}</p>
                <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[o.status] || ''}`}>
                {o.status}
              </span>
              <span className="font-semibold text-navy">₹{Number(o.total).toLocaleString('en-IN')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
