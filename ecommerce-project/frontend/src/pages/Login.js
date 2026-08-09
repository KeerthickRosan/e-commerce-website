import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(form.username, form.password);
    if (res.success) navigate('/');
    else setError(res.error);
  };

  return (
    <div className="max-w-sm mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-navy mb-6 text-center">Sign in</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="text-sm font-medium">Username</label>
          <input
            type="text" required value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input
            type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
        <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded">
          Sign in
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        New here? <Link to="/register" className="text-blue-600 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}
