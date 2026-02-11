import React, { useState, useEffect } from 'react';
import api from '../services/api'; // 🔥 Updated API instance
import { toast, Toaster } from 'react-hot-toast';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '', phone: '', email: '',
    address: { city: '', state: '', pincode: '' }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) setUser(res.data.user);
      } catch (err) {
        console.error("Profile load nahi hui");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/update-profile', user);
      if (res.data.success) {
        toast.success("Profile & Address Updated! ✅");
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      toast.error("Update fail ho gaya!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-[2.5rem] shadow-2xl mt-10 border border-slate-100">
      <Toaster />
      <h2 className="text-3xl font-black mb-8 text-blue-700 tracking-tight">MANAGE PROFILE 👤</h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Phone</label>
            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold" value={user.phone} onChange={(e) => setUser({...user, phone: e.target.value})} />
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest border-b border-slate-200 pb-2">Delivery Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <input className="p-4 bg-white border-none rounded-2xl font-bold shadow-sm" placeholder="City" value={user.address?.city || ''} onChange={(e) => setUser({...user, address: {...user.address, city: e.target.value}})} />
            <input className="p-4 bg-white border-none rounded-2xl font-bold shadow-sm" placeholder="State" value={user.address?.state || ''} onChange={(e) => setUser({...user, address: {...user.address, state: e.target.value}})} />
          </div>
          <input className="p-4 bg-white border-none rounded-2xl font-bold shadow-sm w-full" placeholder="Pincode" value={user.address?.pincode || ''} onChange={(e) => setUser({...user, address: {...user.address, pincode: e.target.value}})} />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-1">
          SAVE CHANGES
        </button>
      </form>
    </div>
  );
};

export default UserProfile;