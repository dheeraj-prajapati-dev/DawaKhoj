import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../context/AuthContext'; // 🔥 Naya API instance
import { toast, Toaster } from 'react-hot-toast';

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔥 Direct API call (No manual headers needed)
      await API.post('/pharmacy/register', {
        storeName: form.storeName,
        phone: form.phone,
        address: { street: form.address },
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        homeDelivery: form.homeDelivery,
        open24x7: form.open24x7,
      });

      toast.success('Pharmacy registered! Pending admin approval. 🎉', { duration: 5000 });
      
      // Redirect to inventory or dashboard
      setTimeout(() => navigate('/pharmacy/inventory'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <Toaster position="top-center" />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 transition-all">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest">
            Partner Program
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Register Your Pharmacy 🏥
          </h1>
          <p className="text-slate-500 font-medium mt-2">Join the DawaKhoj network and start receiving orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Store Name</label>
              <input
                name="storeName"
                placeholder="e.g. LifeCare Pharmacy"
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium"
                value={form.storeName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Phone Number</label>
              <input
                name="phone"
                placeholder="10-digit mobile number"
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Complete Address</label>
              <textarea
                name="address"
                placeholder="Street, Landmark, City, Pincode"
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium min-h-[100px]"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Latitude</label>
                <input
                  name="latitude"
                  placeholder="e.g. 20.27"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium"
                  value={form.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">Longitude</label>
                <input
                  name="longitude"
                  placeholder="e.g. 73.00"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm focus:bg-white focus:border-blue-100 focus:outline-none transition-all font-medium"
                  value={form.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="homeDelivery"
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                checked={form.homeDelivery}
                onChange={handleChange}
              />
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Home Delivery Available</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="open24x7"
                className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                checked={form.open24x7}
                onChange={handleChange}
              />
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">Open 24x7</span>
            </label>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? 'Processing Registration...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}