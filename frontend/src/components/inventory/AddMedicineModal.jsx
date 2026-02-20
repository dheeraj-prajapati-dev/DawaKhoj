import { useState } from 'react';
import { API } from '../../context/AuthContext'; 
import { toast } from 'react-hot-toast';
import { 
  X, Plus, Beaker, Package, 
  IndianRupee, Tag, ClipboardList, Loader2, Image as ImageIcon 
} from 'lucide-react';

export default function AddMedicineModal({ onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    medicineName: '',
    salt: '',
    category: 'OTC', // Default
    price: '',
    stock: '',
    image: '' // New Field
  });

  const categories = ['Prescription', 'OTC', 'Devices', 'Baby Care', 'Personal Care', 'Supplements', 'Ayurvedic', 'First Aid'];

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
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim() // Sending image URL
      });

      toast.success('Unit Deployed to Inventory! 📦', {
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
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                <Plus className="text-blue-500" /> Add <span className="text-blue-500">Asset</span>
              </h3>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
                <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm" name="medicineName" placeholder="BRAND NAME" onChange={handleChange} required />
              </div>
              <div className="relative group">
                <Beaker className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
                <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm" name="salt" placeholder="SALT COMP." onChange={handleChange} />
              </div>
            </div>

            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
              <select 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm appearance-none" 
                name="category" 
                value={form.category}
                onChange={handleChange}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-slate-900">{cat.toUpperCase()}</option>)}
              </select>
            </div>

            <div className="relative group">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
              <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm" name="image" placeholder="IMAGE URL (Paste link here)" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500" size={18} />
                <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-all text-sm" name="price" type="number" placeholder="PRICE" onChange={handleChange} required />
              </div>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500" size={18} />
                <input className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-orange-400 font-bold outline-none focus:border-orange-500 transition-all text-sm" name="stock" type="number" placeholder="STOCK" onChange={handleChange} required />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm Add Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}