import React, { useState, useEffect } from 'react';
import { useAuth, API } from '../context/AuthContext'; 
import { toast, Toaster } from 'react-hot-toast';
import { 
  User, MapPin, Phone, Mail, Save, 
  Loader2, Camera, ShieldCheck, Zap 
} from 'lucide-react';

export default function UserProfile() {
  const { user: authUser, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: { city: '', state: '', pincode: '' }
  });

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
      const res = await API.put('/auth/update-profile', profile);
      if (res.data.success) {
        toast.success("Profile Synchronized! ✅", {
          style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
        });
        login(res.data.user); 
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Link failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-4 md:px-8 font-sans relative overflow-hidden">
      <Toaster position="bottom-right" />
      
      {/* 🌌 Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Profile Header Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-slate-800/60 shadow-2xl mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={120} className="text-blue-500" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative">
              <div className="w-40 h-40 rounded-[3rem] bg-slate-950 border-2 border-slate-800 p-2 shadow-inner">
                <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-6xl font-black italic border border-white/10 shadow-2xl text-white">
                  {profile.name?.charAt(0) || 'U'}
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-500 p-4 rounded-2xl border-4 border-slate-900 shadow-xl transition-all hover:scale-110 active:scale-90">
                <Camera size={20} />
              </button>
            </div>
            
            <div className="text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
                  {profile.name || 'Agent User'}
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.4em] mt-3 flex items-center justify-center md:justify-start gap-2">
                   <ShieldCheck size={14} className="text-blue-500" /> Node Authorization: Level 1
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400">
                  Account Status: Active
                </div>
                <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Role: {authUser?.role}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Sections */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Core Credentials */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-slate-800/60 space-y-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-3">
                <User size={16} /> Personal Data
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Identity</label>
                <input 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-bold text-sm placeholder:text-slate-800" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})} 
                  placeholder="Enter Name"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Communication Line</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 focus:border-blue-500 outline-none transition-all font-bold text-sm" 
                    value={profile.phone} 
                    onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="group space-y-2 opacity-60">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Registered Email (Fixed)</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" />
                  <input 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 outline-none font-bold text-sm cursor-not-allowed" 
                    value={profile.email} 
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Logistics / Address */}
          <div className="bg-slate-900/40 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-slate-800/60 space-y-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3">
                <MapPin size={16} /> Delivery Node
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">City</label>
                  <input 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold text-sm" 
                    placeholder="e.g. Mumbai" 
                    value={profile.address.city} 
                    onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">State</label>
                  <input 
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold text-sm" 
                    placeholder="Maharashtra" 
                    value={profile.address.state} 
                    onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Pincode / Zip</label>
                <input 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold text-sm" 
                  placeholder="400001" 
                  value={profile.address.pincode} 
                  onChange={(e) => setProfile({...profile, address: {...profile.address, pincode: e.target.value}})} 
                />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest leading-relaxed">
                   * Logistics data ensures medicines are sourced from the nearest available node.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="md:col-span-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="group w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Save size={18} className="group-hover:rotate-12 transition-transform" />}
              Update User Profile Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}