import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authHeader } from '../utils/authHeader';

export default function PharmacyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    homeDelivery: false,
    open24x7: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/pharmacy/register',
        {
          storeName: form.storeName,
          phone: form.phone,
          address: { street: form.address },
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          homeDelivery: form.homeDelivery,
          open24x7: form.open24x7,
        },
        { headers: authHeader() }
      );

      alert('Pharmacy registered. Waiting for admin approval.');
      navigate('/pharmacy/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Register Your Pharmacy
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="storeName"
            placeholder="Store Name"
            className="input"
            value={form.storeName}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            className="input"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            placeholder="Store Address"
            className="input"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="latitude"
              placeholder="Latitude"
              className="input"
              value={form.latitude}
              onChange={handleChange}
              required
            />
            <input
              name="longitude"
              placeholder="Longitude"
              className="input"
              value={form.longitude}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="homeDelivery"
                checked={form.homeDelivery}
                onChange={handleChange}
              />
              Home Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="open24x7"
                checked={form.open24x7}
                onChange={handleChange}
              />
              Open 24x7
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Pharmacy'}
          </button>
        </form>
      </div>
    </div>
  );
}
