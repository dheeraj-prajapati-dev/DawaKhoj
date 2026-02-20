import { useState, useEffect } from 'react';
import { API } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  X, Save, Beaker, Package, 
  IndianRupee, Tag, ClipboardList, Loader2, Image as ImageIcon 
} from 'lucide-react';

export default function EditMedicineModal({ item, onClose, refresh }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    price: item.price || '',
    stock: item.stock || '',
    image: item.medicine?.image || '', // Existing image link
    category: item.medicine?.category || 'OTC'
  });

  const categories = ['Prescription', 'OTC', 'Devices', 'Baby Care', 'Personal Care', 'Supplements', 'Ayurvedic', 'First Aid'];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend ko update request bhej rahe hain
      await API.put(`/inventory/update/${item._id}`, {
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim(), // Updating image URL
        category: form.category
      });

      toast.success('Asset Calibrated! ⚡', {
        style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
      });
      refresh();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex justify-center items-center z-[110] p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-200">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase flex items-center gap-3">
                <Save className="text-blue-500" size={24} /> Edit <span className="text-blue-500">Asset</span>
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                Modifying: {item.medicine?.name}
              </p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image URL Field */}
            <div className="relative group">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500" size={18} />
              <input 
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-blue-500 transition-all text-sm" 
                name="image" 
                value={form.image}
                placeholder="UPDATE IMAGE URL" 
                onChange={handleChange} 
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-all text-sm" 
                  name="price" 
                  type="number" 
                  value={form.price}
                  placeholder="PRICE" 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="relative group">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-orange-500" size={18} />
                <input 
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-orange-400 font-bold outline-none focus:border-orange-500 transition-all text-sm" 
                  name="stock" 
                  type="number" 
                  value={form.stock}
                  placeholder="STOCK" 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : 'Apply Calibration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}