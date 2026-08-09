import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(form);
    if (res.success) navigate('/');
    else setError(typeof res.error === 'string' ? res.error : JSON.stringify(res.error));
  };

  return (
    <div className="max-w-sm mx-auto py-16 px-4">
      <h1 className="text-2xl font-bold text-navy mb-6 text-center">Create account</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-3">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {['username', 'email', 'first_name', 'last_name'].map((field) => (
          <input
            key={field}
            type={field === 'email' ? 'email' : 'text'}
            placeholder={field.replace('_', ' ')}
            required={field === 'username'}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm capitalize"
          />
        ))}
        <input
          type="password" placeholder="Password" required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <input
          type="password" placeholder="Confirm password" required
          value={form.password2}
          onChange={(e) => setForm({ ...form, password2: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm"
        />
        <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded">
          Create account
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
