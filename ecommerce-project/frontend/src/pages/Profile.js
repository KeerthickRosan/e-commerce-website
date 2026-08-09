import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Profile() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/auth/profile/').then(({ data }) => setForm(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/auth/profile/', form);
    setMessage('Profile updated successfully.');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!form) return <p className="text-center py-16 text-gray-500">Loading profile...</p>;

  const fields = [
    ['first_name', 'First name'], ['last_name', 'Last name'], ['email', 'Email'],
    ['phone', 'Phone'], ['address_line1', 'Address line 1'], ['address_line2', 'Address line 2'],
    ['city', 'City'], ['state', 'State'], ['postal_code', 'Postal code'], ['country', 'Country'],
  ];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-navy mb-5">My Profile</h1>
      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-3">
        {message && <p className="text-green-600 text-sm">{message}</p>}
        <p className="text-sm text-gray-500">Username: <strong>{form.username}</strong> (role: {form.role})</p>
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="text-sm font-medium">{label}</label>
            <input
              value={form[key] || ''}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border rounded px-3 py-2 mt-1 text-sm"
            />
          </div>
        ))}
        <button type="submit" className="w-full bg-accent hover:bg-accent-dark text-navy font-semibold py-2 rounded">
          Save changes
        </button>
      </form>
    </div>
  );
}
