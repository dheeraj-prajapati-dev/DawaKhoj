import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '', phone: '', email: '',
    address: { city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    // Backend se current user data lao
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://dawakhoj.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setUser(res.data.user);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('https://dawakhoj.onrender.com/api/auth/update-profile', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) alert("Profile & Address Updated! ✅");
    } catch (err) {
      alert("Update fail ho gaya!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-10">
      <h2 className="text-2xl font-black mb-6 text-blue-700 uppercase">Manage Profile</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input className="p-3 border rounded-xl" placeholder="Name" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
          <input className="p-3 border rounded-xl" placeholder="Phone" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
        </div>
        
        <h3 className="font-bold text-gray-700 mt-4 border-b pb-2">Delivery Address</h3>
        <div className="grid grid-cols-2 gap-4">
          <input className="p-3 border rounded-xl" placeholder="City" value={user.address?.city || ''} onChange={(e) => setUser({...user, address: {...(user.address || {}), city: e.target.value}})} />
          <input className="p-3 border rounded-xl" placeholder="State" value={user.address?.state} onChange={(e) => setUser({...user, address: {...user.address, state: e.target.value}})} />
        </div>
        <input className="p-3 border rounded-xl w-full" placeholder="Pincode" value={user.address?.pincode} onChange={(e) => setUser({...user, address: {...user.address, pincode: e.target.value}})} />
        
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700">SAVE CHANGES</button>
      </form>
    </div>
  );
};

export default UserProfile;