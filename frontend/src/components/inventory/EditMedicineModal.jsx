import { useState } from 'react';
import { API } from '../../context/AuthContext'; 
import { toast } from 'react-hot-toast';
import { X, Save, IndianRupee, Package, Loader2, Edit3, Activity, Image as ImageIcon } from 'lucide-react';

export default function EditMedicineModal({ item, onClose, refresh }) {
  const [price, setPrice] = useState(item.price);
  const [stock, setStock] = useState(item.stock);
  const [image, setImage] = useState(item.medicine?.image || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/inventory/update/${item._id}`, { 
        price: Number(price), 
        stock: Number(stock),
        image: image // Update image too
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
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white bg-slate-800/50 rounded-xl transition-all"><X size={20} /></button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Edit <span className="text-blue-500">{item.medicine?.name || "Medicine"}</span></h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2"><ImageIcon size={12}/> Asset Image URL</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-blue-400 font-bold outline-none focus:border-blue-500 transition-all text-sm" placeholder="Paste link..."/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2"><IndianRupee size={12}/> Price</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-emerald-400 font-black outline-none focus:border-emerald-500 transition-all" required/>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 ml-2"><Package size={12}/> Stock</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-blue-400 font-black outline-none focus:border-blue-500 transition-all" required/>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Push Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}