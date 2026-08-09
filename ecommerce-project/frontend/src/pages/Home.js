import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const ordering = searchParams.get('ordering') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      if (category) params.category = category;
      if (ordering) params.ordering = ordering;
      const { data } = await api.get('/products/', { params });
      setProducts(data.results || data);
      setCount(data.count ?? (data.results ? data.results.length : data.length));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, ordering]);

  useEffect(() => {
    api.get('/products/categories/').then(({ data }) => setCategories(data.results || data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => setPage(1), [search, category, ordering]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6">
        <img src="/images/shop-online-banner.webp" alt="Shop Online banner" className="w-full rounded-lg shadow-sm" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-56 shrink-0">
          <h3 className="font-semibold text-navy mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left px-2 py-1 rounded ${!category ? 'bg-accent/20 font-semibold' : 'hover:bg-gray-100'}`}
              >
                All
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => updateParam('category', c.slug)}
                  className={`w-full text-left px-2 py-1 rounded ${category === c.slug ? 'bg-accent/20 font-semibold' : 'hover:bg-gray-100'}`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>

          <h3 className="font-semibold text-navy mt-6 mb-2">Sort by</h3>
          <select
            value={ordering}
            onChange={(e) => updateParam('ordering', e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="">Relevance</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-created_at">Newest First</option>
            <option value="-average_rating">Top Rated</option>
          </select>
        </aside>

        <div className="flex-1">
          {search && (
            <p className="text-sm text-gray-600 mb-3">
              Showing results for <span className="font-semibold">"{search}"</span> ({count} found)
            </p>
          )}
          {loading ? (
            <p className="text-gray-500 py-12 text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 py-12 text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {count > 12 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-1.5 border rounded disabled:opacity-40"
              >
                Previous
              </button>
              <span className="px-3 py-1.5">Page {page}</span>
              <button
                disabled={page * 12 >= count}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-1.5 border rounded disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
