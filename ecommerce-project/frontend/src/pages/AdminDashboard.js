import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products/', { params: { all: 'true', page_size: 1 } }),
      api.get('/orders/admin/all/'),
    ]).then(([prodRes, orderRes]) => {
      const orders = orderRes.data.results || orderRes.data;
      const revenue = orders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total), 0);
      setStats({
        products: prodRes.data.count ?? (prodRes.data.results || prodRes.data).length,
        orders: orders.length,
        revenue,
      });
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-navy">{stats.products}</p>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-navy">{stats.orders}</p>
        </div>
        <div className="bg-white border rounded-lg p-5">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-navy">₹{stats.revenue.toLocaleString('en-IN')}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/admin/products" className="bg-navy text-white px-5 py-2.5 rounded hover:bg-navy-light">
          Manage Products
        </Link>
        <Link to="/admin/orders" className="bg-navy text-white px-5 py-2.5 rounded hover:bg-navy-light">
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
