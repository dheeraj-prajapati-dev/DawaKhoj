import { useState } from 'react';
import { API } from '../../context/AuthContext'; 
import { toast } from 'react-hot-toast';
import { 
  X, Plus, Beaker, Package, 
  IndianRupee, Tag, ClipboardList, Loader2 
} from 'lucide-react';

export default function AddMedicineModal({ onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    medicineName: '',
    salt: '',
    category: '',
    price: '',
    stock: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/inventory/add', {
        medicineName: form.medicineName.trim(),
        salt: form.salt.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stock: Number(form.stock)
      });

      toast.success('Inventory Updated! 📦', {
        style: { background: '#0f172a', color: '#fff', border: '1px solid #10b981' }
      });
      refresh(); 
      onClose(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sync data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-[100] p-4">
      {/* 🌌 Modal Container */}
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Header Overlay Effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                <Plus className="text-blue-500" /> Add <span className="text-blue-500">Medicine</span>
              </h3>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Registering new stock in node</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Medicine Name & Salt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-700" 
                  name="medicineName" 
                  placeholder="BRAND NAME" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="relative group">
                <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-700" 
                  name="salt" 
                  placeholder="SALT COMP." 
                  onChange={handleChange} 
                />
              </div>
            </div>

            {/* Category */}
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
              <input 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm placeholder:text-slate-700 uppercase" 
                name="category" 
                placeholder="CATEGORY (e.g. Antibiotics, Painkiller)" 
                onChange={handleChange} 
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-all text-sm placeholder:text-slate-700" 
                  name="price" 
                  type="number" 
                  placeholder="UNIT PRICE" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-orange-400 font-bold outline-none focus:border-orange-500 transition-all text-sm placeholder:text-slate-700" 
                  name="stock" 
                  type="number" 
                  placeholder="INITIAL STOCK" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Add Entry'}
              </button>
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
              >
                Abort
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}