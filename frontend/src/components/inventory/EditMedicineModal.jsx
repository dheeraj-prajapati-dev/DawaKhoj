import { useState } from 'react';
import { API } from '../../context/AuthContext'; 
import { toast } from 'react-hot-toast';
import { 
  X, Save, IndianRupee, Package, 
  Loader2, Edit3, Activity 
} from 'lucide-react';

export default function EditMedicineModal({ item, onClose, refresh }) {
  const [price, setPrice] = useState(item.price);
  const [stock, setStock] = useState(item.stock);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/inventory/update/${item._id}`, { 
        price: Number(price), 
        stock: Number(stock) 
      });
      
      toast.success("Inventory recalibrated! ✅", {
        style: { background: '#0f172a', color: '#fff', border: '1px solid #3b82f6' }
      });
      refresh();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-xl transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-4">
            <Edit3 size={12} /> Data Override
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            Edit <span className="text-blue-500">{item.medicine?.name || "Medicine"}</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Salt: {item.medicine?.salt || "N/A"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price Adjustment */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
              <IndianRupee size={12} className="text-emerald-500" /> New Price Unit
            </label>
            <div className="relative">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-emerald-400 font-black outline-none focus:border-emerald-500/50 transition-all text-lg"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase">INR</div>
            </div>
          </div>

          {/* Stock Adjustment */}
          <div className="space-y-2 group">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
              <Package size={12} className="text-blue-500" /> Inventory Level
            </label>
            <div className="relative">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-blue-400 font-black outline-none focus:border-blue-500/50 transition-all text-lg"
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700 uppercase">Units</div>
            </div>
          </div>

          {/* Current Status Info */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
            <div className={`p-2 rounded-lg ${stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <Activity size={16} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Preview</p>
              <p className={`text-[10px] font-bold uppercase ${stock < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                {stock < 10 ? 'Critical: Low Stock Level' : 'Stable: Stock Sufficient'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-2xl transition-all uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Push Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}