import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PharmacyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    homeDelivery: false,
    open24x7: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/pharmacy/register',
        {
          storeName: form.storeName,
          phone: form.phone,
          address: form.address,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
          homeDelivery: form.homeDelivery,
          open24x7: form.open24x7
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Pharmacy registered successfully. Waiting for admin approval.');
      navigate('/pharmacy/inventory');

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register Your Pharmacy</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="storeName"
          placeholder="Store Name"
          value={form.storeName}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="address"
          placeholder="Full Address"
          value={form.address}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="latitude"
          placeholder="Latitude"
          value={form.latitude}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="longitude"
          placeholder="Longitude"
          value={form.longitude}
          onChange={handleChange}
          required
        /><br /><br />

        <label>
          <input
            type="checkbox"
            name="homeDelivery"
            checked={form.homeDelivery}
            onChange={handleChange}
          />
          Home Delivery Available
        </label><br /><br />

        <label>
          <input
            type="checkbox"
            name="open24x7"
            checked={form.open24x7}
            onChange={handleChange}
          />
          Open 24x7
        </label><br /><br />

        <button type="submit">Register Pharmacy</button>
      </form>
    </div>
  );
}
