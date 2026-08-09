import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const emptyForm = {
  name: '', description: '', price: '', discount_price: '', stock: '', brand: '', category: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadProducts = () => {
    api.get('/products/', { params: { all: 'true' } }).then(({ data }) => setProducts(data.results || data));
  };

  useEffect(() => {
    loadProducts();
    api.get('/products/categories/').then(({ data }) => setCategories(data.results || data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock: Number(form.stock),
      category: form.category || null,
    };
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}/`, payload);
        setMessage('Product updated.');
      } else {
        await api.post('/products/', payload);
        setMessage('Product created.');
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      setMessage(JSON.stringify(err.response?.data) || 'Error saving product.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (p) => {
    setEditingId(p.slug);
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      discount_price: p.discount_price || '', stock: p.stock, brand: p.brand || '',
      category: p.category || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${slug}/`);
    loadProducts();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 space-y-3 h-fit">
        <h2 className="font-semibold text-navy">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        {message && <p className="text-sm text-green-600 break-words">{message}</p>}
        <input required placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm" />
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm" rows={3} />
        <div className="grid grid-cols-2 gap-2">
          <input required type="number" step="0.01" placeholder="Price" value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input type="number" step="0.01" placeholder="Discount price" value={form.discount_price}
            onChange={(e) => setForm({ ...form, discount_price: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input required type="number" placeholder="Stock" value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
          <input placeholder="Brand" value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="border rounded px-3 py-2 text-sm" />
        </div>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm">
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded text-sm">
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}
              className="px-3 border rounded text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="md:col-span-2">
        <h2 className="font-semibold text-navy mb-3">All Products ({products.length})</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-white border rounded-lg p-3">
              <div>
                <p className="font-medium text-navy text-sm">{p.name}</p>
                <p className="text-xs text-gray-500">₹{p.price} · Stock: {p.stock} {!p.is_active && '· (inactive)'}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.slug)} className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
