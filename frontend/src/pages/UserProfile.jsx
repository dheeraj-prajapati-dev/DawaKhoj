import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext'; // 🔥 Context se API aur User liya
import { toast, Toaster } from 'react-hot-toast';
import { User, MapPin, Phone, Mail, Save, Loader2, Camera } from 'lucide-react';

export default function UserProfile() {
  const { user: authUser, login } = useAuth(); // Global user state
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: { city: '', state: '', pincode: '' }
  });

  // Initial Data Load
  useEffect(() => {
    if (authUser) {
      setProfile({
        name: authUser.name || '',
        phone: authUser.phone || '',
        email: authUser.email || '',
        address: {
          city: authUser.address?.city || '',
          state: authUser.address?.state || '',
          pincode: authUser.address?.pincode || ''
        }
      });
    }
  }, [authUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 🚀 Using API instance from context
      const res = await API.put('/auth/update-profile', profile);
      if (res.data.success) {
        toast.success("Profile & Address Updated! ✅");
        login(res.data.user); // Context ko naya data do taaki poori site refresh ho jaye
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update fail ho gaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-12 px-6">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 bg-slate-900/40 p-8 rounded-[3rem] border border-slate-800/60 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[80px] rounded-full"></div>
          
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-5xl font-black border-4 border-slate-800 shadow-2xl">
              {profile.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full border-2 border-slate-900">
              <Camera size={16} />
            </div>
          </div>
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">{profile.name || 'User Name'}</h1>
            <div className="flex gap-3 justify-center md:justify-start">
              <span className="px-4 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black tracking-widest uppercase">Verified User</span>
              <span className="px-4 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px] font-black tracking-widest uppercase">{authUser?.role}</span>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Info Card */}
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/60 space-y-6">
            <h3 className="text-sm font-black flex items-center gap-2 text-blue-400 uppercase tracking-widest border-b border-slate-800 pb-4">
              <User size={18} /> Basic Info
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all font-bold" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-5 text-slate-600" />
                  <input 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-5 py-4 focus:border-blue-500 outline-none transition-all font-bold" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800/60 space-y-6">
            <h3 className="text-sm font-black flex items-center gap-2 text-emerald-400 uppercase tracking-widest border-b border-slate-800 pb-4">
              <MapPin size={18} /> Shipping Address
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">City</label>
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:border-emerald-500 outline-none transition-all font-bold" 
                  placeholder="City" 
                  value={profile.address.city} 
                  onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">State</label>
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:border-emerald-500 outline-none transition-all font-bold" 
                  placeholder="State" 
                  value={profile.address.state} 
                  onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pincode</label>
              <input 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-5 py-4 focus:border-emerald-500 outline-none transition-all font-bold" 
                placeholder="Pincode" 
                value={profile.address.pincode} 
                onChange={(e) => setProfile({...profile, address: {...profile.address, pincode: e.target.value}})} 
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
              SAVE PROFILE CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}