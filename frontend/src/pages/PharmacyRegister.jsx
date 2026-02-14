import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Store, Phone, MapPin, Navigation, 
  Truck, Clock, ChevronRight, ShieldCheck 
} from 'lucide-react';

export default function PharmacyRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState({
    storeName: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
    homeDelivery: false,
    open24x7: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // 📍 Auto-fetch Location Logic
  const fetchLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by browser");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6)
        });
        toast.success("Location locked! 🎯");
        setLocating(false);
      },
      () => {
        toast.error("Location access denied");
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/pharmacy/register', {
        storeName: form.storeName,
        phone: form.phone,
        address: { street: form.address },
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        homeDelivery: form.homeDelivery,
        open24x7: form.open24x7,
      });

      toast.success('Registration Sent! Awaiting Admin Clearance.', { 
        duration: 5000,
        style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
      });
      
      setTimeout(() => navigate('/pharmacy/inventory'), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 md:p-8 font-sans text-white relative overflow-hidden">
      <Toaster position="top-center" />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full"></div>

      <div className="bg-slate-900/50 backdrop-blur-2xl w-full max-w-2xl rounded-[3rem] border border-slate-800 p-8 md:p-12 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <ShieldCheck size={14} /> Partner Onboarding
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">
            Join <span className="text-blue-500">DawaKhoj+</span>
          </h1>
          <p className="text-slate-500 font-bold text-xs mt-3 uppercase tracking-widest italic opacity-80">Deploy your pharmacy to the network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Store Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                <Store size={12} /> Store Name
              </label>
              <input
                name="storeName"
                placeholder="e.g. APOLLO PHARMA"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700"
                value={form.storeName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                <Phone size={12} /> Contact Number
              </label>
              <input
                name="phone"
                placeholder="10-digit mobile"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2 flex items-center gap-2">
                <MapPin size={12} /> Dispatch Address
              </label>
              <textarea
                name="address"
                placeholder="Complete street address, City, Pincode"
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700 min-h-[100px] resize-none"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Location Coordinates */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 relative">
              <div className="space-y-2">
                <input
                  name="latitude"
                  placeholder="Latitude"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-xs focus:border-blue-500 outline-none transition-all font-mono text-blue-400"
                  value={form.latitude}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <input
                  name="longitude"
                  placeholder="Longitude"
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 text-xs focus:border-blue-500 outline-none transition-all font-mono text-blue-400"
                  value={form.longitude}
                  readOnly
                />
              </div>
              <button
                type="button"
                onClick={fetchLocation}
                disabled={locating}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
                title="Auto-fetch coordinates"
              >
                <Navigation size={16} className={locating ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            <label className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${form.homeDelivery ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-900/30'}`}>
              <div className="flex items-center gap-3">
                <Truck className={form.homeDelivery ? 'text-blue-500' : 'text-slate-600'} size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Home Delivery</span>
              </div>
              <input type="checkbox" name="homeDelivery" hidden checked={form.homeDelivery} onChange={handleChange} />
              <div className={`w-4 h-4 rounded-full border-2 ${form.homeDelivery ? 'bg-blue-500 border-blue-400' : 'border-slate-700'}`}></div>
            </label>

            <label className={`flex items-center justify-between p-5 rounded-[1.5rem] border-2 transition-all cursor-pointer ${form.open24x7 ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/30'}`}>
              <div className="flex items-center gap-3">
                <Clock className={form.open24x7 ? 'text-emerald-500' : 'text-slate-600'} size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Open 24/7</span>
              </div>
              <input type="checkbox" name="open24x7" hidden checked={form.open24x7} onChange={handleChange} />
              <div className={`w-4 h-4 rounded-full border-2 ${form.open24x7 ? 'bg-emerald-500 border-emerald-400' : 'border-slate-700'}`}></div>
            </label>
          </div>

          <button
            disabled={loading}
            className="group w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-900/40 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? 'Transmitting Data...' : 'Submit Application'}
            {!loading && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}