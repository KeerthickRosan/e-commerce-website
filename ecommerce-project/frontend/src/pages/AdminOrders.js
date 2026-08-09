import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_OPTIONS = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => {
    api.get('/orders/admin/all/').then(({ data }) => setOrders(data.results || data));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/admin/${id}/status/`, { status });
    load();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-5">All Orders</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-navy">{o.order_number} <span className="text-gray-400 font-normal">· {o.username}</span></p>
                <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-navy">₹{Number(o.total).toLocaleString('en-IN')}</p>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="mt-1 border rounded px-2 py-1 text-xs capitalize"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {o.items.map((i) => `${i.product_name} x${i.quantity}`).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
